<?php

header("Content-Type: application/json; charset=utf-8");

// Requerimos el archivo modelos.php
require_once 'modelos.php';
require_once 'auth.php';

// Si hay un parámetro tabla
if(isset($_GET['tabla'])) {
    $tabla = new Modelo($_GET['tabla']); // Creamos el objeto $tabla   

    if(isset($_GET['id'])) { // Si está seteado el id
        $tabla->setCriterio("id=" . $_GET['id']); // Establecemos el criterio
    }

    if(isset($_GET['accion'])) { // Si está seteada la acción
        if($_GET['accion'] == 'insertar' || $_GET['accion'] == 'actualizar') { // Si la acción es insertar o actualizar
            $valores = $_POST; // Guardamos los valores que vienen desde el formulario
            if (empty($valores)) {
                $rawInput = file_get_contents('php://input');
                $decoded = json_decode($rawInput, true);
                if (is_array($decoded)) {
                    $valores = $decoded;
                }
            }
            
            // **** SUBIDA DE IMÁGENES **** //
        if(                                             // Si
                isset($_FILES) &&                       // Está seteado $_FILES Y
                isset($_FILES['imagen']) &&             // Está seteado imagen dentro de $_FILES
                !empty($_FILES['imagen']['name']) &&     // Si NO está vacío el nombre Y
                !empty($_FILES['imagen']['tmp_name']))  // el nombre temporal
              {
            if(is_uploaded_file($_FILES['imagen']['tmp_name'])) {                       // Si está subido el archivo temporal
                    $nombre_temporal = $_FILES['imagen']['tmp_name'];                   // Guardamos el nombre temporal
                    $nombre = $_FILES['imagen']['name'];                                // Guardamos el nombre
                    $destino = '../imagenes/productos/' . $nombre;                      // Guardamos la carpeta de subida

                    if(move_uploaded_file($nombre_temporal, $destino)) {                // Si se puede mover el archivo temporal al destino
                        $respuesta = [                                                  // Definimos una respuesta
                            'success' => true,
                            'message' => 'Archivo subido correctamente a ' . $destino
                        ];
                        $valores['imagen'] = $nombre;                                   // Guardamos el nombre de la imagen en el array valores
                    } else {
                        $respuesta = [
                            'success' => false,
                            'message' => 'No se ha podido subir el archivo'
                        ];
                        unlink(ini_get('upload_tmp_dir') . $nombre_temporal);           // Eliminamos el archivo temporal
                    }
                } else {
                    $respuesta = [
                        'success' => false,
                        'message' => 'El archivo no fue procesado correctamente'
                    ];
                }
            }
        }        

        switch ($_GET['accion']) { // Según la acción
            case 'seleccionar':
                $datos = $tabla->seleccionar(); // Ejecutamos el método seleccionar
                echo json_encode($datos) ; // Mostramos los datos
                break;

            case 'insertar':     
                // $usuario = validarToken(['clientes', 'admin']);           
                // Ejecutamos el método insertar y capturamos el ID
                $id = $tabla->insertar($valores);
    
                // Verificamos si se obtuvo un ID válido
                if ($id > 0) {
                    $respuesta = [
                        'success' => true,
                        'message' => 'Registro insertado correctamente.',
                        'id' => $id 
                    ];
                } else {
                    // En caso de que falle la inserción
                    $respuesta = [
                        'success' => false,
                        'message' => 'Error al insertar el registro.'
                    ];
                }
                
                // Siempre enviamos la respuesta JSON al final
                echo json_encode($respuesta);
                break;

                case 'actualizar':
                    if (isset($_GET['id']) && $tabla->getCriterio() == '') {
                        $tabla->setCriterio("id=" . intval($_GET['id']));
                    }
                    $tabla->actualizar($valores);
                    $respuesta = [
                        'success' => true,
                        'message' => 'Registro actualizado con éxito'
                    ];
                    echo json_encode($respuesta);
                    break;

                case 'eliminar':
                    if (isset($_GET['id']) && $tabla->getCriterio() == '') {
                        $tabla->setCriterio("id=" . intval($_GET['id']));
                    }
                    $tabla->eliminar();
                    $respuesta = [
                        'success' => true,
                        'message' => 'Registro eliminado con éxito'
                    ];
                    echo json_encode($respuesta);
                    break;

            
        }
    }
    
}
?>