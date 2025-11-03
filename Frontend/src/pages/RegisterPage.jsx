import react, { useState } from 'react';

const RegisterPage = () => {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [pw, setPw] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('회원가입 정보 : ', { id, name, pw });
        alert('회원가입이 완료되었습니다.');
        //성공 시 로그인 페이지로 이동
        }

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
            <h1>Register</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label htmlFor="id" style={{ display: 'block', marginBottom: '5px' }}>사용자 이름</label>
                    <input
                        type="text"
                        name="id"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box'}}
                    />
                    <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>사용자 이름</label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setId(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box'}}
                    />
                    <label htmlFor="pw" style={{ display: 'block', marginBottom: '5px' }}>사용자 이름</label>
                    <input
                        type="password"
                        name="pw"
                        value={pw}
                        onChange={(e) => setId(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box'}}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>Sign Up</button>
            </form>
        </div>
        );
    };

export default RegisterPage;