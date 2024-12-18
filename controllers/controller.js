const prisma = require('../prisma');
const genPassword = require('../lib/passwordUtils').genPassword
const passport = require('passport');
require('../config/passport');

exports.indexGet = (req, res, next) => {
    const user = req.user;
    
    res.render('index', {user});
}
exports.registerGet = (req, res, next) => {
    res.render('register');
}
exports.registerPost = async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const saltHash = genPassword(req.body.password);
    const sex = req.body.sex;
    const f_name = req.body.f_name;
    const l_name = req.body.l_name;

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const user = await prisma.user.create({
        data: {
            hash,
            salt,
            username,
            email,
            sex,
            f_name,
            l_name,
        },
    })
    res.redirect('/');
}

exports.loginGet = (req, res, next) => {
    res.render('login');
}
exports.validate = passport.authenticate(
    'local',
    {
        failureRedirect: '/login-failure',
    }
)
exports.loginPost = (req, res) => {
    res.redirect('/');
}

exports.logoutGet = (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
}

exports.profileGet = async (req, res) => {
    const user = req.user;
    
    const profileUsername = req.params.username;
    const profileUser = await prisma.user.findUnique({
        where: {
            username: profileUsername,
        },
        include: {
            friends: true,
            friendRequests: true,
            friendRejections: true,
            postsReceived: {
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    comment: {
                        orderBy: {
                            createdAt: 'desc',
                        },
                    }
                }
            }
        }
    })
    const posts = await Promise.all(profileUser.postsReceived.map(async post => {
        const usernameObject = await prisma.user.findUnique({
            where: {
                id: post.authorId,
            },
            select: {
                username: true,
            }
        })
        const username = usernameObject.username;
        const text = post.text;
        const time = post.createdAt;
        const postId = post.id;
        const userId = post.authorId;
        const likedBy = post.likedBy;
        
        const comments = await Promise.all(post.comment.map(async comment => {
            const usernameObject = await prisma.user.findUnique({
                where: {
                    id: comment.userId,
                },
                select: {
                    username: true,
                }
            })
            
            const username = usernameObject.username;
            const text = comment.text;
            const time = comment.createdAt;
            const id = comment.id;
            const userId = comment.userId;
            const likedBy = comment.likedBy;
            return {username, text, time, id, userId, likedBy}
        }))

        
        return {username, text, time, postId, userId, likedBy, comments}
    }));


    res.render('profile', {user, profileUser, posts});
}

exports.userSearchGet = async (req, res) => {
    const search = req.query;
    let searchResults = {};
    if (search.search) {
        searchResults = await prisma.user.findMany({
            where: {
                username: {
                    contains: search.search,
                },
            },
        })
    }
    
    res.render('userSearch', {search, searchResults});
}

exports.sendFriendRequestGet = async (req, res) => {
    const userId = req.user.id;
    const friendUserId = parseInt(req.params.userId);
    
    await prisma.user.update({
        where: {
            id: friendUserId,
        },
        data: {
            friendRequests: {
                connect: {
                    id: userId,
                }
            }
        }
    })

    res.redirect('/')
}

exports.acceptRequestGet = async (req, res) => {
    const userId = req.user.id;
    const requestUserId = parseInt(req.params.requestUserId);

    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            friends: {
                connect: {
                    id: requestUserId,
                }
            },
            friendRequests: {
                disconnect: {
                    id: requestUserId
                }
            }
        }
    })
    await prisma.user.update({
        where: {
            id: requestUserId,
        },
        data: {
            friends: {
                connect: {
                    id: userId,
                }
            }
        }
    })
    res.redirect('/');
}

exports.rejectRequestGet = async (req, res) => {
    const userId = req.user.id;
    const requestUserId = parseInt(req.params.requestUserId);
    
    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            friendRequests: {
                disconnect: {
                    id: requestUserId,
                }
            },
            friendRejections: {
                connect: {
                    id: requestUserId,
                }
            }
        }
    })
    res.redirect('/');
}

exports.writeOnWallPost = async (req, res, next) => {
    await prisma.post.create({
        data: {
            text: req.body.text,
            authorId: parseInt(req.body.userId),
            receiverId: parseInt(req.body.profileUserId),
        }
    })

    // req.params = {username: 'a'};/////
    res.redirect(`/profile/${req.body.profileUsername}`)
}

exports.likePostPost = async (req, res) => {

    await prisma.post.update({
        where: {
            id: parseInt(req.body.postId),
        },
        data: {
            likedBy: {
                push: parseInt(req.body.userId)
            }
        }
    })

    // await prisma.postLike.create({
    //     data: {
    //         postId: parseInt(req.body.postId),
    //         userId: parseInt(req.body.userId),
    //     }
    // })
    res.redirect(`/profile/${req.body.profileUsername}`)
}

exports.unlikePostPost = async (req, res) => {
    
    const likedByObject = await prisma.post.findUnique({
        where: {
            id: parseInt(req.body.postId),
        },
        select: {
            likedBy: true,
        }
    })
    const likedBy = likedByObject.likedBy;
    console.log(likedBy);
    const newLikedBy = likedBy.filter(id => id !== parseInt(req.body.userId));
    console.log(newLikedBy);

    await prisma.post.update({
        where: {
            id: parseInt(req.body.postId),
        },
        data: {
            likedBy: newLikedBy,
        }
    })
    
    // await prisma.postLike.delete({
    //     where: {
    //         id: parseInt(req.body.likeId),
    //     }
    // })
    res.redirect(`/profile/${req.body.profileUsername}`)
}

exports.commentPost = async (req, res) => {
    await prisma.comment.create({
        data: {
            postId: parseInt(req.body.postId),
            userId: parseInt(req.body.userId),
            text: req.body.text,
        }
    })
    res.redirect(`/profile/${req.body.profileUsername}`)
}

exports.likeCommentPost = async (req, res) => {
    
    await prisma.comment.update({
        where: {
            id: parseInt(req.body.commentId),
        },
        data: {
            likedBy: {
                push: parseInt(req.body.userId)
            }
        }
    })

    // await prisma.commentLike.create({
    //     data: {
    //         commentId: parseInt(req.body.commentId),
    //         userId: parseInt(req.body.userId),
    //     }
    // })
    res.redirect(`/profile/${req.body.profileUsername}`)
}

exports.unlikeCommentPost = async (req, res) => {
    const likedByObject = await prisma.comment.findUnique({
        where: {
            id: parseInt(req.body.commentId),
        },
        select: {
            likedBy: true,
        }
    })
    const likedBy = likedByObject.likedBy;
    console.log(likedBy);
    const newLikedBy = likedBy.filter(id => id !== parseInt(req.body.userId));
    console.log(newLikedBy);

    await prisma.comment.update({
        where: {
            id: parseInt(req.body.commentId),
        },
        data: {
            likedBy: newLikedBy,
        }
    })

    // await prisma.commentLike.delete({
    //     where: {
    //         id: parseInt(req.body.likeId),
    //     }
    // })
    res.redirect(`/profile/${req.body.profileUsername}`)
}

/////only display 'send request' if it hasnt been sent already
/////remove 'send request' after friend request accepted
/////and a "respond to friend request"

/////if a requests b, b should not see a "add a" on a's profile, rather, respond to request
///// remove 'friend request sent' after it's accepted (but not if it's rejected)

///// can a send b a friend request if a has already rejected one from b?