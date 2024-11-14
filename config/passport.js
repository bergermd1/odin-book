const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const prisma = require('../prisma');
const { validPassword } = require('../lib/passwordUtils.js');

async function findUser(username) {    
    const user = await prisma.user.findUnique({
        where: {
            username: username,
        },
    })
    return user;
 }
 async function findById(id) {
    const user = await prisma.user.findUnique({
        where: {
            id: id,
        },
        include: {
            friends: true,
            friendRequests: true,
        }
    })
    return user;
 }

passport.use(new LocalStrategy(
    async function(email, password, done) {
        try {
            const user = await findUser(email);
            if (!user) {
                return done(null, false);
            }
            
            const isValid = validPassword(password, user.hash, user.salt);

            if (isValid) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        }
        catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await findById(id);
        
        done(null, user);
    } catch (err) {
        done(err);
    }
})
