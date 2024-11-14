const prisma = require('./prisma');

// console.log(prisma);

async function addUsers() {
    
    // await prisma.user.deleteMany();

    // await prisma.user.createMany({
    //     data: [
    //         {
    //             hash:'a',
    //             salt:'a',
    //             username:'a',
    //             email:'a',
    //             sex:'a',
    //             f_name:'a',
    //             l_name:'a',
    //         },
    //         {
    //             hash:'b',
    //             salt:'b',
    //             username:'b',
    //             email:'b',
    //             sex:'b',
    //             f_name:'b',
    //             l_name:'b',
    //         },
    //         {
    //             hash:'c',
    //             salt:'c',
    //             username:'c',
    //             email:'c',
    //             sex:'c',
    //             f_name:'c',
    //             l_name:'c',
    //         },
    //         {
    //             hash:'d',
    //             salt:'d',
    //             username:'d',
    //             email:'d',
    //             sex:'d',
    //             f_name:'d',
    //             l_name:'d',
    //         },
    //         {
    //             hash:'e',
    //             salt:'e',
    //             username:'e',
    //             email:'e',
    //             sex:'e',
    //             f_name:'e',
    //             l_name:'e',
    //         },
    // ]})
}

// addUsers();

async function addFriends() {
    await prisma.user.update({
        where: {
            id: 19,
        },
        data: {
            friends: {
                connect: {
                    id: 20,
                }
            }
        }
    })
    await prisma.user.update({
        where: {
            id: 20,
        },
        data: {
            friends: {
                connect: {
                    id: 19,
                }
            }
        }
    })
}

addFriends();

async function show() {
    const users = await prisma.user.findMany({
        // select: {
        //     id: true,
        // },
        include: {
            friends: true,
        }
    });
    console.log(users[1].friends);
    
}

// show()
