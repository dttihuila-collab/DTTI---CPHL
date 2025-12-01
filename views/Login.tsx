
import React, { useState, useContext } from 'react';
import { AuthContext } from '../App';
import { SecurityIcon } from '../components/icons/Icon';
import { Input, Button, Label } from '../components/common/FormElements';

const Login: React.FC = () => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = await login(username, password);
        if (!success) {
            setError('Nome de usuário ou senha inválidos.');
        }
    };

    return (
        <div className="min-h-screen bg-custom-blue-50 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
                <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-custom-blue-100 rounded-full mb-4">
                        <SecurityIcon className="w-8 h-8 text-custom-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-custom-blue-700">SCCPHL</h1>
                    <p className="text-gray-600 mt-2">Sistema de Controle do CPHL</p>
                    <p className="text-gray-500 text-sm">Faça login para aceder ao painel</p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <Label htmlFor="username">Nome de Usuário</Label>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="password">Senha</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                    <Button type="submit" className="w-full">
                        Entrar
                    </Button>
                </form>

                <div className="border-t pt-4 mt-6 text-center">
                    <p className="text-xs text-gray-400">
                        DTTI - Departamento de Telecomunicações e Tecnologias de Informação
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;