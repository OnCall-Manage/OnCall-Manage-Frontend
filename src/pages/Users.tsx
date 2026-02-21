import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import * as userService from "@/services/userService";
import type { User } from "@/types/auth";

export default function Users() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<User>>({
        role: "USER",
    });

    // Solo admins pueden acceder a esta página
    useEffect(() => {
        if (user && user.role !== "ADMIN") {
            navigate("/", { replace: true });
            toast.error("No tienes permisos para acceder a esta página");
        }
    }, [user, navigate]);

    // Cargar usuarios
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                const data = await userService.getAllUsers();
                setUsers(data);
            } catch (error) {
                console.error("❌ Error al cargar usuarios");
                toast.error(`Error al cargar los usuarios`);
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.role === "ADMIN") {
            fetchUsers();
        }
    }, [user]);

    const handleOpenDialog = (userToEdit?: User) => {
        if (userToEdit) {
            setEditingId(userToEdit.id);
            setFormData(userToEdit);
        } else {
            setEditingId(null);
            setFormData({ role: "USER" });
        }
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
        setEditingId(null);
        setFormData({ role: "USER" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !formData.username ||
            !formData.nombre ||
            !formData.apellido ||
            !formData.email ||
            !formData.puesto ||
            !formData.role ||
            (!editingId && !(formData as any).password)
        ) {
            toast.error("Por favor completa todos los campos");
            return;
        }

        try {
            setIsSubmitting(true);

            let savedUser: User;
            if (editingId) {
                savedUser = await userService.updateUser(editingId, formData);
                setUsers(users.map((u) => (u.id === editingId ? savedUser : u)));
                toast.success("Usuario actualizado correctamente");
            } else {
                savedUser = await userService.createUser(formData as any);
                setUsers([...users, savedUser]);
                toast.success("Usuario creado correctamente");
            }

            handleCloseDialog();
        } catch (error) {
            toast.error(
                editingId
                    ? "Error al actualizar el usuario"
                    : "Error al crear el usuario"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            return;
        }

        try {
            await userService.deleteUser(id);
            setUsers(users.filter((u) => u.id !== id));
            toast.success("Usuario eliminado correctamente");
        } catch (error) {
            toast.error("Error al eliminar el usuario");
        }
    };

    if (user?.role !== "ADMIN") {
        return null;
    }

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Gestionar Usuarios</h1>
                        <p className="text-foreground/60 mt-1">
                            Crea y administra los usuarios del sistema
                        </p>
                    </div>
                    <Dialog open={showDialog} onOpenChange={setShowDialog}>
                        <DialogTrigger asChild>
                            <Button onClick={() => handleOpenDialog()}>
                                <Plus className="h-4 w-4 mr-2" />
                                Nuevo Usuario
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingId ? "Editar Usuario" : "Crear Nuevo Usuario"}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingId
                                        ? "Actualiza la información del usuario"
                                        : "Completa los datos del nuevo usuario"}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nombre">Nombre</Label>
                                        <Input
                                            id="nombre"
                                            value={formData.nombre || ""}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    nombre: e.target.value,
                                                })
                                            }
                                            placeholder="Juan"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="apellido">Apellido</Label>
                                        <Input
                                            id="apellido"
                                            value={formData.apellido || ""}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    apellido: e.target.value,
                                                })
                                            }
                                            placeholder="Pérez"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="username">Nombre de Usuario</Label>
                                    <Input
                                        id="username"
                                        value={formData.username || ""}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                username: e.target.value,
                                            })
                                        }
                                        placeholder="jperez"
                                        disabled={!!editingId}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo Electrónico</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email || ""}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                email: e.target.value,
                                            })
                                        }
                                        placeholder="jperez@example.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="puesto">Puesto</Label>
                                    <Input
                                        id="puesto"
                                        value={formData.puesto || ""}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                puesto: e.target.value,
                                            })
                                        }
                                        placeholder="DBA Senior"
                                    />
                                </div>

                                {!editingId && (
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Contraseña</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={(formData as any).password || ""}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    password: e.target.value,
                                                } as any)
                                            }
                                            placeholder="••••••••"
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="role">Rol</Label>
                                    <Select
                                        value={formData.role || "USER"}
                                        onValueChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                role: value as "ADMIN" | "USER",
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USER">Usuario</SelectItem>
                                            <SelectItem value="ADMIN">Administrador</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCloseDialog}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? "Guardando..." : "Guardar"}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Usuarios del Sistema</CardTitle>
                        <CardDescription>
                            Total: {users.length} usuario{users.length !== 1 ? "s" : ""}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center text-foreground/60">
                                Cargando usuarios...
                            </div>
                        ) : users.length === 0 ? (
                            <div className="text-center text-foreground/60">
                                No hay usuarios creados aún
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Usuario</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Puesto</TableHead>
                                            <TableHead>Rol</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((u) => (
                                            <TableRow key={u.id}>
                                                <TableCell className="font-medium">
                                                    {u.nombre && u.apellido ? `${u.nombre} ${u.apellido}` : u.nombre || u.username}
                                                </TableCell>
                                                <TableCell>{u.username}</TableCell>
                                                <TableCell>{u.email}</TableCell>
                                                <TableCell>{u.puesto}</TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs font-semibold ${
                                                            u.role === "ADMIN"
                                                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                                                        }`}
                                                    >
                                                        {u.role === "ADMIN"
                                                            ? "Administrador"
                                                            : "Usuario"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleOpenDialog(u)}
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(u.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

