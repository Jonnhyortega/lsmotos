import { Overlay } from '@/components/ui/Overlay';
import { BookOpen, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface HelpCenterProps {
    isOpen: boolean;
    onClose: () => void;
}

export function HelpCenter({ isOpen, onClose }: HelpCenterProps) {
    return (
        <Overlay isOpen={isOpen} onClose={onClose} title="Centro de Ayuda">
            <div className="space-y-8 pr-2">
                <div className="bg-ls-accent/10 border border-ls-accent/20 p-4 rounded-lg flex items-start gap-3">
                    <Info className="text-ls-accent shrink-0 mt-1" />
                    <div>
                        <h3 className="font-bold text-ls-accent mb-1">Bienvenido al Panel de Administración</h3>
                        <p className="text-sm text-gray-300">Aquí podrás gestionar todo el contenido de tu sitio web de forma sencilla. A continuación encontrarás una guía rápida de las funciones principales.</p>
                    </div>
                </div>

                <section>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="bg-white/10 p-1.5 rounded-lg text-sm">1</span> Gestión de Marcas
                    </h3>
                    <div className="pl-4 border-l-2 border-white/10 space-y-3">
                        <p className="text-gray-400 text-sm">Antes de cargar motos, asegúrate de tener las marcas creadas en la pestaña <strong>"Marcas"</strong>.</p>
                        <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                            <li><strong>Crear:</strong> Ingresa el nombre, define una prioridad (más alto = aparece primero) y sube el logo.</li>
                            <li><strong>Eliminar:</strong> Usa el icono de basura. <span className="text-red-400 text-xs">(¡Cuidado! Borra primero las motos de esa marca).</span></li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="bg-white/10 p-1.5 rounded-lg text-sm">2</span> Gestión de Catálogo
                    </h3>
                    <div className="pl-4 border-l-2 border-white/10 space-y-3">
                        <p className="text-gray-400 text-sm">Administra tus modelos en la pestaña <strong>"Catálogo"</strong>.</p>
                        <div className="space-y-2">
                            <div className="bg-white/5 p-3 rounded-lg">
                                <h4 className="font-bold text-white text-sm mb-1">Cargar Nueva Moto</h4>
                                <p className="text-xs text-gray-400">Selecciona la marca, escribe el modelo, define prioridad interna y sube la foto.</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg">
                                <h4 className="font-bold text-white text-sm mb-1">Editar Moto ✏️</h4>
                                <p className="text-xs text-gray-400">Pasa el mouse sobre la foto de cualquier moto y haz click en el lápiz para modificar sus datos.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="bg-white/10 p-1.5 rounded-lg text-sm">3</span> Suscriptores y Leads
                    </h3>
                    <div className="pl-4 border-l-2 border-white/10 space-y-3">
                        <p className="text-gray-400 text-sm">Gestiona los contactos en la pestaña <strong>"Suscriptores"</strong>.</p>
                        <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                            <li><strong>Exportar CSV:</strong> Descarga la lista completa para usar en Excel.</li>
                            <li><strong>Mailing Masivo:</strong> Selecciona usuarios y usa el botón de "Enviar" para mandar correos y promociones.</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="bg-white/10 p-1.5 rounded-lg text-sm">4</span> Configuración
                    </h3>
                    <div className="pl-4 border-l-2 border-white/10 space-y-3">
                        <p className="text-sm text-gray-300">Desde el botón de engranaje <span className="inline-block bg-white/10 rounded px-1 text-xs">⚙️</span> arriba a la derecha:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                            <div className="bg-black/20 p-2 rounded border border-white/5 text-xs text-gray-400">
                                <strong className="block text-white mb-1">Contraseña</strong>
                                Cambia tu clave de acceso regularmente por seguridad.
                            </div>
                            <div className="bg-black/20 p-2 rounded border border-white/5 text-xs text-gray-400">
                                <strong className="block text-white mb-1">Email Admin</strong>
                                Solicita el cambio de correo de administrador (requiere verificación).
                            </div>
                        </div>
                    </div>
                </section>

                <div className="pt-4 border-t border-white/10 text-center">
                    <p className="text-xs text-white/30 italic">Sistema desarrollado para LS Motos v1.0</p>
                </div>
            </div>
        </Overlay>
    );
}
