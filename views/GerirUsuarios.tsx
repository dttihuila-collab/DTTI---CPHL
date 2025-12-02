import React, { useState, useEffect, useCallback } from 'react';
import { User, Role, View } from '../types';
import { api } from '../services/api';
import { PERMISSION_VIEWS } from '../constants';
import Modal from '../components/Modal';
import { Label, Input, Select, Button, FormError } from '../components/common/FormElements';
import { AddIcon, EditIcon, DeleteIcon } from '../components/icons/Icon';
import { useToast } from '../contexts/ToastContext';
import { DataTable, ColumnDef } from '../components/common/DataTable';

const GerirUsuarios: React.FC = React.memo(() => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);
    const [formErrors, setFormErrors] = useState<{ password?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useToast();

    const loadUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const userList = await api.getUsers();
            setUsers(userList);
        } catch (error) {
            addToast('Falha ao carregar usuários.', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const openModal = (user: User | null = null) => {
        setCurrentUser(user ? { ...user, password: '' } : { name: '', role: Role.Padrao, password: '', permissions: ['Dashboard'] });
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
    
    const validateField = (name: 'password', value: string) => {
        const newErrors = { ...formErrors };
        
        if (name === 'password') {
            if (!currentUser?.id && (!value || value.trim() === '')) {
                newErrors.password = "A senha é obrigatória para novos usuários.";
            } else {
                 delete newErrors.password;
            }
        }
        
        setFormErrors(newErrors);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target as { name: 'password', value: string };
        validateField(name, value);
    };

    const handleSave = async () => {
        // Validate all fields on save
        validateField('password', currentUser?.password || '');
        
        // Re-check errors state after validation
        if (formErrors.password || (!currentUser.id && !currentUser.password)) {
             addToast('Por favor, corrija os erros no formulário.', 'error');
            return;
        }
        
        if (!currentUser) return;

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
                const newErrors = { ...formErrors };
                delete newErrors[name as keyof typeof formErrors];
                setFormErrors(newErrors);
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

    const columns: ColumnDef<User>[] = [
        { accessorKey: 'name', header: 'Nome' },
        { accessorKey: 'role', header: 'Perfil' },
    ];
    
    const renderRowActions = (user: User) => (
        <>
            <button onClick={() => openModal(user)} className="text-custom-blue-600 hover:text-custom-blue-800 dark:text-custom-blue-400 dark:hover:text-custom-blue-300"><EditIcon /></button>
            <button onClick={() => openDeleteModal(user)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"><DeleteIcon /></button>
        </>
    );

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Gerir Usuários</h2>
                <Button onClick={() => openModal()}>
                    <AddIcon />
                    <span className="ml-2">Adicionar Usuário</span>
                </Button>
            </div>
            
            <DataTable 
                columns={columns}
                data={users}
                isLoading={isLoading}
                renderRowActions={renderRowActions}
            />

            <Modal isOpen={isModalOpen} onClose={closeModal} title={currentUser?.id ? 'Editar Usuário' : 'Adicionar Usuário'}>
                <div className="space-y-4">
                    <div><Label htmlFor="name">Nome</Label><Input id="name" name="name" type="text" value={currentUser?.name || ''} onChange={handleFormChange} required /></div>
                    <div>
                        <Label htmlFor="password">Senha</Label>
                        <Input id="password" name="password" type="password" value={currentUser?.password || ''} onChange={handleFormChange} onBlur={handleBlur} error={formErrors.password} placeholder={currentUser?.id ? 'Deixar em branco para não alterar' : ''}/>
                        <FormError message={formErrors.password} />
                    </div>
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
});

export default GerirUsuarios;