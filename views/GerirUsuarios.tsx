import React, { useState, useEffect, useCallback, useContext } from 'react';
import { User, Role, Subsystem } from '../types';
import { api } from '../services/api';
import { SUBSYSTEMS, PATENTES, ORGAOS_UNIDADES } from '../constants';
import Modal from '../components/Modal';
import { Label, Input, Select, Button, FormError } from '../components/common/FormElements';
import { AddIcon, EditIcon, DeleteIcon } from '../components/icons/Icon';
import { useToast } from '../contexts/ToastContext';
import { DataTable, ColumnDef } from '../components/common/DataTable';
import { AuthContext } from '../contexts/AuthContext';

const GerirUsuarios: React.FC = React.memo(() => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<Partial<User> & { password?: string } | null>(null);
    const [formErrors, setFormErrors] = useState<{ name?: string, password?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useToast();

    // Authorization Guard
    if (user?.role !== Role.Admin) {
        return (
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Acesso Negado</h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Não tem permissão para aceder a esta página.</p>
            </div>
        );
    }

    const loadUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const userList = await api.getUsers();
            setUsers(userList);
        } catch (error) {
            addToast('Falha ao carregar utilizadores.', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const openModal = (user: User | null = null) => {
        setCurrentUser(user ? { ...user, password: '' } : { name: '', role: Role.Padrao, password: '', permissions: [], patente: '', orgaoUnidade: '', funcao: '' });
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
    
    const handleSave = async () => {
        if (!currentUser) return;

        const finalErrors: { name?: string; password?: string } = {};
        if (!currentUser.name || currentUser.name.trim() === '') {
            finalErrors.name = "O nome de utilizador é obrigatório.";
        }
        if (!currentUser.id && (!currentUser.password || currentUser.password.trim() === '')) {
            finalErrors.password = "A palavra-passe é obrigatória para novos utilizadores.";
        }
    
        setFormErrors(finalErrors);
        
        if (Object.keys(finalErrors).length > 0) {
            addToast('Por favor, corrija os erros no formulário.', 'error');
            return;
        }
        
        setIsSubmitting(true);
        try {
            const userToSave = { ...currentUser };
            if (userToSave.role === Role.Admin || userToSave.role === Role.Supervisor) {
                userToSave.permissions = [];
            }

            if (currentUser.id) {
                await api.updateUser(userToSave as User & { password?: string });
                addToast('Utilizador atualizado com sucesso!', 'success');
            } else {
                await api.addUser(userToSave as Omit<User, 'id'> & { password?: string });
                addToast('Utilizador adicionado com sucesso!', 'success');
            }
            await loadUsers();
            closeModal();
        } catch (error) {
            addToast('Ocorreu um erro ao guardar o utilizador.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDelete = async () => {
        if(currentUser && currentUser.id) {
            setIsSubmitting(true);
            try {
                await api.deleteUser(currentUser.id);
                addToast('Utilizador eliminado com sucesso!', 'success');
                await loadUsers();
            } catch (error) {
                addToast('Ocorreu um erro ao eliminar o utilizador.', 'error');
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
             if (name === 'role' && value !== Role.Padrao) {
                updatedUser.permissions = [];
            }
            setCurrentUser(updatedUser);
            if (formErrors[name as keyof typeof formErrors]) {
                const newErrors = { ...formErrors };
                delete newErrors[name as keyof typeof formErrors];
                setFormErrors(newErrors);
            }
        }
    };

    const handlePermissionChange = (permission: Subsystem) => {
        if (currentUser) {
            const currentPermissions = currentUser.permissions || [];
            const newPermissions = currentPermissions.includes(permission)
                ? currentPermissions.filter(p => p !== permission)
                : [...currentPermissions, permission];
            setCurrentUser({ ...currentUser, permissions: newPermissions });
        }
    };

    const columns: ColumnDef<User>[] = [
        { accessorKey: 'name', header: 'Nome de Utilizador' },
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
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Gerir Utilizadores</h2>
                <Button onClick={() => openModal()}>
                    <AddIcon />
                    <span className="ml-2">Adicionar Utilizador</span>
                </Button>
            </div>
            
            <DataTable 
                columns={columns}
                data={users}
                isLoading={isLoading}
                renderRowActions={renderRowActions}
            />

            <Modal isOpen={isModalOpen} onClose={closeModal} title={currentUser?.id ? 'Editar Utilizador' : 'Adicionar Utilizador'}>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nome de Utilizador</Label>
                        <Input id="name" name="name" type="text" value={currentUser?.name || ''} onChange={handleFormChange} required error={formErrors.name} />
                        <FormError message={formErrors.name} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <Label htmlFor="patente">Patente</Label>
                           <Select id="patente" name="patente" value={currentUser?.patente || ''} onChange={handleFormChange}>
                                <option value="">Selecione a Patente</option>
                                {PATENTES.map(p => <option key={p} value={p}>{p}</option>)}
                           </Select>
                        </div>
                        <div>
                            <Label htmlFor="funcao">Função</Label>
                            <Input id="funcao" name="funcao" type="text" value={currentUser?.funcao || ''} onChange={handleFormChange} />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="orgaoUnidade">Orgão/Unidade</Label>
                        <Select id="orgaoUnidade" name="orgaoUnidade" value={currentUser?.orgaoUnidade || ''} onChange={handleFormChange}>
                            <option value="">Selecione o Orgão/Unidade</option>
                            {ORGAOS_UNIDADES.map(o => <option key={o} value={o}>{o}</option>)}
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="password">Palavra-passe</Label>
                        <Input id="password" name="password" type="password" value={currentUser?.password || ''} onChange={handleFormChange} error={formErrors.password} placeholder={currentUser?.id ? 'Deixar em branco para não alterar' : ''}/>
                        <FormError message={formErrors.password} />
                    </div>
                    <div><Label htmlFor="role">Perfil</Label><Select id="role" name="role" value={currentUser?.role || ''} onChange={handleFormChange}>{Object.values(Role).map(role => (<option key={role} value={role}>{role}</option>))}</Select></div>
                    
                    {currentUser?.role === Role.Padrao && (
                        <fieldset className="border dark:border-gray-600 p-4 rounded-md">
                             <legend className="text-sm font-medium text-gray-900 dark:text-gray-200 px-1">Acesso a Subsistemas</legend>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                {(Object.keys(SUBSYSTEMS) as Subsystem[]).map(subsystem => (
                                    <div key={subsystem} className="flex items-center">
                                        <input id={`perm-${subsystem}`} type="checkbox" checked={currentUser.permissions?.includes(subsystem) || false} onChange={() => handlePermissionChange(subsystem)} className="h-4 w-4 text-custom-blue-600 border-gray-300 rounded focus:ring-custom-blue-500 dark:bg-gray-600 dark:border-gray-500" />
                                        <label htmlFor={`perm-${subsystem}`} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">{subsystem}</label>
                                    </div>
                                ))}
                            </div>
                        </fieldset>
                    )}

                    {(currentUser?.role === Role.Admin || currentUser?.role === Role.Supervisor) && (
                        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {currentUser.role === Role.Admin ? "Administradores têm acesso total a todos os subsistemas." : "Supervisores têm acesso de visualização a todos os subsistemas."}
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="secondary" onClick={closeModal}>Cancelar</Button>
                        <Button onClick={handleSave} isLoading={isSubmitting}>Guardar</Button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} title="Confirmar Eliminação">
                <p className="text-gray-700 dark:text-gray-300">Tem a certeza de que deseja eliminar o utilizador <strong>{currentUser?.name}</strong>? Esta ação não pode ser desfeita.</p>
                <div className="flex justify-end space-x-2 pt-6">
                    <Button variant="secondary" onClick={closeDeleteModal}>Cancelar</Button>
                    <Button variant="danger" onClick={handleDelete} isLoading={isSubmitting}>Eliminar</Button>
                </div>
            </Modal>
        </div>
    );
});

export default GerirUsuarios;
