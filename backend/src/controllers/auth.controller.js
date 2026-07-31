import * as authService from "../services/auth.service.js";
export async function register(req, res) {
    try {
        const result = await authService.register(req.body);

        return res.status(201).json(result);
    } catch (err) {
        return res.status(400).json({
            error: err.message,
        });
    }
}
export async function login(req, res) {
    try {
        const result = await authService.login(req.body);

        return res.status(200).json(result);
    } catch (err) {
        return res.status(400).json({
            error: err.message,
        });
    }
}