import 'dotenv/config'
import express from 'express'
import cors from 'cors';
import queryString from 'query-string'
import cookieParser from 'cookie-parser'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

const config = {
    clientId:"**************************************",
    clientSecret: "**************************************",
    authUrl: '**************************************',
    tokenUrl: '**************************************',
    redirectUrl: ["**************************************"],
    clientUrl: ["**************************************"],
    tokenSecret: "**************************************",
    postUrl: '**************************************',
    tokenExpiration: 36000,
}

const authParams = queryString.stringify({
    client_id: config.clientId,
    redirect_uri: config.redirectUrl,
    response_type: 'code',
    scope: 'openid profile email',
    access_type: 'offline',
    state: 'standard_oauth',
    prompt: 'consent',
})

const getTokenParams = (code) =>
    queryString.stringify({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: config.redirectUrl,
    })

const app = express()

// Resolve CORS
app.use(
    cors({
        origin: [config.clientUrl],
        credentials: true,
    }),
)

app.use(cookieParser())
app.use(express.json())

// MongoDB Connection
mongoose.connect('**************************************', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define counter schema and model
const counterSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

// Verify auth
const auth = (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) return res.status(401).json({ message: 'Unauthorized' })
        const { user } = jwt.verify(token, config.tokenSecret)
        req.user = user
        return next()
    } catch (err) {
        console.error('Error: ', err)
        res.status(401).json({ message: 'Unauthorized' })
    }
}

app.get('/auth/url', (_, res) => {
    res.json({
        url: `${config.authUrl}?${authParams}`,
    })
})

app.get('/auth/token', async (req, res) => {
    const { code } = req.query
    if (!code) return res.status(400).json({ message: 'Authorization code must be provided' })
    try {
        const tokenParam = getTokenParams(code)
        const {
            data: { id_token },
        } = await axios.post(`${config.tokenUrl}?${tokenParam}`)
        if (!id_token) return res.status(400).json({ message: 'Auth error' })
        const { email, name, picture } = jwt.decode(id_token)
        const user = { name, email, picture }
        const token = jwt.sign({ user }, config.tokenSecret, { expiresIn: config.tokenExpiration })
        const counter= new Counter({username:email,count:0})
        counter.save()
        res.cookie('token', token, { maxAge: config.tokenExpiration, httpOnly: true })
        res.json({
            user,
        })
    } catch (err) {
        console.error('Error: ', err)
        res.status(500).json({ message: err.message || 'Server error' })
    }
})

app.get('/auth/logged_in', (req, res) => {
    try {
        const token = req.cookies.token
        if (!token) return res.json({ loggedIn: false })
        const { user } = jwt.verify(token, config.tokenSecret)
        const newToken = jwt.sign({ user }, config.tokenSecret, { expiresIn: config.tokenExpiration })
        res.cookie('token', newToken, { maxAge: config.tokenExpiration, httpOnly: true })
        res.json({ loggedIn: true, user })
    } catch (err) {
        res.json({ loggedIn: false })
    }
})

app.post('/auth/logout', (_, res) => {
    res.clearCookie('token').json({ message: 'Logged out' })
})

app.get('/user/posts', auth, async (req, res) => {
    try {
        const { data } = await axios.get(config.postUrl)
        res.json({ posts: data?.slice(0, 5) })
    } catch (err) {
        console.error('Error: ', err)
    }
})

// Counter functionality
app.get('/api/counter', auth, async (req, res) => {
    try {
        console.log("Reached GET method");
        const { email } = req.user;
        const counter = await Counter.findOne({ username: email });
        console.log(counter)
        res.json({ count: counter?.count || 0 });
    } catch (err) {
        console.error('Error: ', err)
        res.status(500).json({ message: 'Server error' })
    }
});

app.post('/api/counter/increment', auth, async (req, res) => {
    try {
        const { email } = req.user;
        let counter = await Counter.findOne({ username: email });
        if (!counter) {
            counter = new Counter({ username: email, count: 1 });
            await counter.save();
        } else {
            counter.count++;
            await counter.save();
        }
        res.json({ count: counter.count });
    } catch (err) {
        console.error('Error: ', err)
        res.status(500).json({ message: 'Server error' })
    }
});

app.post('/api/counter/decrement', auth, async (req, res) => {
    try {
        const { email } = req.user;
        let counter = await Counter.findOne({ username: email });
        if (!counter) {
            counter = new Counter({ username: email, count: 0 });
            await counter.save();
        } else {
            counter.count--;
            await counter.save();
        }
        res.json({ count: counter.count });
    } catch (err) {
        console.error('Error: ', err)
        res.status(500).json({ message: 'Server error' })
    }
});

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`))