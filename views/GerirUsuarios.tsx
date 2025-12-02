
import React, { useState, useEffect, useCallback } from 'react';
import { User, Role, View } from '../types';
import { api } from '../services/api';
import { PERMISSION_VIEWS } from '../constants';
import Modal from '../components/Modal';
import { Label, Input, Select, Button } from '../components/common/FormElements';
import { AddIcon, EditIcon, DeleteIcon } from '../components/icons/Icon';
import { useToast } from '../contexts/ToastContext';

const GerirUsuarios: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);
    const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useToast();

    const loadUsers = useCallback(async () => {
        const userList = await api.getUsers();
        setUsers(userList);
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const openModal = (user: User | null = null) => {
        setCurrentUser(user ? { ...user, password: '' } : { name: '', email: '', role: Role.Padrao, password: '', permissions: ['Dashboard'] });
        setFormErrors({});
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentUser(null);
        setFormErrors({});
    };

    const openDeleteModal = (user: User) => {
        setCurrentUser(user);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setCurrentUser(null);
    };
    
    const validateForm = () => {
        if (!currentUser) return false;
        
        const errors: { email?: string; password?: string } = {};
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!currentUser.email || !emailRegex.test(currentUser.email)) {
            errors.email = "Por favor, insira um formato de email válido.";
        }

        if (!currentUser.id && (!currentUser.password || currentUser.password.trim() === '')) {
            errors.password = "A senha é obrigatória para novos usuários.";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleSave = async () => {
        if (!currentUser || !validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const userToSave = { ...currentUser };
            if (userToSave.role === Role.Admin) {
                userToSave.permissions = PERMISSION_VIEWS;
            }

            if (currentUser.id) {
                await api.updateUser(userToSave as User);
                addToast('Usuário atualizado com sucesso!', 'success');
            } else {
                await api.addUser(userToSave as Omit<User, 'id'>);
                addToast('Usuário adicionado com sucesso!', 'success');
            }
            await loadUsers();
            closeModal();
        } catch (error) {
            addToast('Ocorreu um erro ao salvar o usuário.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDelete = async () => {
        if(currentUser && currentUser.id) {
            setIsSubmitting(true);
            try {
                await api.deleteUser(currentUser.id);
                addToast('Usuário eliminado com sucesso!', 'success');
                await loadUsers();
            } catch (error) {
                addToast('Ocorreu um erro ao eliminar o usuário.', 'error');
            } finally {
                setIsSubmitting(false);
                closeDeleteModal();
            }
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if(currentUser) {
            const { name, value } = e.target;
            const updatedUser = { ...currentUser, [name]: value };
            if (name === 'role' && value === Role.Admin) {
                updatedUser.permissions = PERMISSION_VIEWS;
            }
            setCurrentUser(updatedUser);
             if (formErrors[name as keyof typeof formErrors]) {
                setFormErrors(prev => ({ ...prev, [name]: undefined }));
            }
        }
    };

    const handlePermissionChange = (permission: View) => {
        if (currentUser) {
            const currentPermissions = currentUser.permissions || [];
            const newPermissions = currentPermissions.includes(permission)
                ? currentPermissions.filter(p => p !== permission)
                : [...currentPermissions, permission];
            setCurrentUser({ ...currentUser, permissions: newPermissions });
        }
    };


    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Gerir Usuários</h2>
                <Button onClick={() => openModal()}>
                    <AddIcon />
                    <span className="ml-2">Adicionar Usuário</span>
                </Button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nome</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Perfil</th>
                            <th scope="col" className="px-6 py-3 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{user.name}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">{user.role}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => openModal(user)} className="text-custom-blue-600 hover:text-custom-blue-800 dark:text-custom-blue-400 dark:hover:text-custom-blue-300"><EditIcon /></button>
                                    <button onClick={() => openDeleteModal(user)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"><DeleteIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={currentUser?.id ? 'Editar Usuário' : 'Adicionar Usuário'}>
                <div className="space-y-4">
                    <div><Label htmlFor="name">Nome</Label><Input id="name" name="name" type="text" value={currentUser?.name || ''} onChange={handleFormChange} required /></div>
                    <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" value={currentUser?.email || ''} onChange={handleFormChange} required/><p className="text-red-500 text-xs mt-1">{formErrors.email}</p></div>
                    <div><Label htmlFor="password">Senha</Label><Input id="password" name="password" type="password" value={currentUser?.password || ''} onChange={handleFormChange} placeholder={currentUser?.id ? 'Deixar em branco para não alterar' : ''}/><p className="text-red-500 text-xs mt-1">{formErrors.password}</p></div>
                    <div><Label htmlFor="role">Perfil</Label><Select id="role" name="role" value={currentUser?.role || ''} onChange={handleFormChange}>{Object.values(Role).map(role => (<option key={role} value={role}>{role}</option>))}</Select></div>
                    {currentUser?.role === Role.Admin && (<div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-center"><p className="text-sm text-gray-600 dark:text-gray-300">Administradores têm acesso a todos os formulários.</p></div>)}
                    {currentUser?.role === Role.Padrao && (
                        <fieldset className="border dark:border-gray-600 p-4 rounded-md">
                             <legend className="text-sm font-medium text-gray-900 dark:text-gray-200 px-1">Permissões de Formulário</legend>
                             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
                                {PERMISSION_VIEWS.map(permission => (
                                    <div key={permission} className="flex items-center">
                                        <input id={`perm-${permission}`} type="checkbox" checked={currentUser.permissions?.includes(permission) || false} onChange={() => handlePermissionChange(permission)} className="h-4 w-4 text-custom-blue-600 border-gray-300 rounded focus:ring-custom-blue-500 dark:bg-gray-600 dark:border-gray-500" />
                                        <label htmlFor={`perm-${permission}`} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">{permission}</label>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">Para acesso de apenas visualização, selecione somente 'Dashboard'.</p>
                        </fieldset>
                    )}
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="secondary" onClick={closeModal}>Cancelar</Button>
                        <Button onClick={handleSave} isLoading={isSubmitting}>Salvar</Button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} title="Confirmar Eliminação">
                <p className="text-gray-700 dark:text-gray-300">Tem a certeza que deseja eliminar o usuário <strong>{currentUser?.name}</strong>? Esta ação não pode ser desfeita.</p>
                <div className="flex justify-end space-x-2 pt-6">
                    <Button variant="secondary" onClick={closeDeleteModal}>Cancelar</Button>
                    <Button variant="danger" onClick={handleDelete} isLoading={isSubmitting}>Eliminar</Button>
                </div>
            </Modal>
        </div>
    );
};

export default GerirUsuarios;