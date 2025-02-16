import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = e => {
        e.preventDefault();

        axios({
            method: "POST",
            url: "http://localhost:8080/loginProc",
            data: {username, password},
            headers: {"Content-Type": "application/json"}
        })
        .then(res => {
            console.log(res);
            // JWT 토큰을 세션 스토리지에 저장
            sessionStorage.setItem("token", res.data);
            navigate("/list");
        })
        .catch(err => console.log(err));
    };

    return (
        <>
            <h1>로그인 페이지</h1>

            <form onSubmit={handleSubmit}>
                Username: <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                <br />
                Password: <input type="text" value={password} onChange={e => setPassword(e.target.value)} />
                <br />
                <button type="submit">로그인</button>
            </form>
        </>
    )
}