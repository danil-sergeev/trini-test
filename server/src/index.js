import http from 'http';
import { route, register } from './core/router';
import { renderHtml, redirect, parseHtmlForm } from './core/utils';
import { newSession, isSession, getSid, deleteSession } from './core/sessions';
import { initializeMongo } from './core/db';
import { User } from './models';

register('/register', (req, res) => {
	if (req.method === 'GET') renderHtml(res, 'register');

	if (req.method === 'POST') {
		let body = [];
		req.on('data', (chunk) => body.push(chunk)).on('end', async () => {
			try {
				body = Buffer.concat(body).toString();
				const reqBody = parseHtmlForm(body);
				const { username = null, password: passwordHash = null } = reqBody;
				if (!username || !passwordHash) throw new Error('No login or password provided');
				const user = await User.findOne({ username });
				if (user) {
					res.setHeader('Content-Type', 'application/json');
					const response = JSON.stringify({ success: false, error: 'Such user already exists' });
					res.end(response);
				} else {
					const newUser = new User({ username, passwordHash });
					await newUser.save();
					redirect(res, '/login');
				}
			} catch (error) {
				res.setHeader('Content-Type', 'application/json');
				const response = JSON.stringify({ success: false, message: error.message });
				res.end(response);
			}
		});
	}
});

register('/login', (req, res) => {
	if (req.method === 'GET') {
		if (isSession(req, res)) {
			redirect(res, '/me');
			return;
		} else renderHtml(res, 'login');
	}

	if (req.method === 'POST') {
		let body = [];
		req.on('data', (chunk) => body.push(chunk)).on('end', async () => {
			body = Buffer.concat(body).toString();
			const reqBody = parseHtmlForm(body);
			const { username = null, password = null } = reqBody;
			if (!username || !password) throw new Error('No login or password provided');
			const user = await User.findOne({ username });
			if (!user) {
				renderHtml(res, 'no-user');
				return;
			}
			if (!isSession(req, res) && user && user.validatePassword(password)) {
				newSession(req, res, user?._id);
				redirect(res, '/me');
			}
		});
	}
});

register('/logout', (req, res) => {
	if (req.method === 'GET') {
		const sid = getSid(req, res);
		deleteSession(sid);
		redirect(res, '/login');
	}
});

register('/me', async (req, res) => {
	const sid = getSid(req, res);
	if (!sid || !isSession(req, res)) redirect(res, '/login');
	else {
		const user = await User.findById(sid);

		const htmlForRender = `
            <div>
                <p>Hello, <b>${user?.username}</b></p>
                <a href="/logout">Logout</a>
            </div>
        `;

		renderHtml(res, null, htmlForRender);
	}
});

export const server = http.createServer((req, res) => {
	const handler = route(req, res);
	if (handler) handler.process(req, res);
});

initializeMongo();
server.listen(process.env.PORT, () => console.log(`Server started at ${process.env.PORT}`));
server.on('error', (error) => console.error);
