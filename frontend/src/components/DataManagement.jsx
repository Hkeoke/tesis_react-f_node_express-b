import { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Form,
  Alert,
  Modal,
  Card,
} from "react-bootstrap";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { TextDataFetcher } from "./TextDataFetcher";

export function DataManagement() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      const response = await axios.get(
        `http://localhost:3000/api/data/obtener/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData(response.data);
    } catch (err) {
      setError("Fallo al obtener los datos");
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      await axios.post(
        "http://localhost:3000/api/data/crear",
        { title, content, id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Datos adicionados con exito");
      setTitle("");
      setContent("");
      setShowAddModal(false);
      fetchData();
    } catch (err) {
      setError("No se pudo adicionar los datos");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const id1 = localStorage.getItem("id");
      console.log(id1);
      console.log(id);
      await axios.delete(
        `http://localhost:3000/api/data/delete/${id}`,

        {
          headers: { Authorization: `Bearer ${token}` },
          data: { id: id1 },
        }
      );
      toast.success("Datos eliminados con exito");
      fetchData();
    } catch (err) {
      toast.error("No se pudo eliminar los datos");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      await axios.put(
        `http://localhost:3000/api/data/update/${editingItem.id}`,
        {
          title: editingItem.title,
          content: editingItem.content,
          id: id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Datos actualizados con exito");
      setShowEditModal(false);
      fetchData();
    } catch (err) {
      setError("Nos se pudo actualizar los datos");
    }
  };

  return (
    <Container
      fluid
      style={{
        padding: "1cm !important", // 1cm de padding en todos los bordes
        height: "100vh",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <h2 className="text-center mb-4">Manejo de Proyectos</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <div
        style={{
          display: "flex",
          gap: "20px",
          height: "calc(100vh - 200px)",
        }}
      >
        <Card
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <Card.Header>
            <h5 className="mb-2">Lista de Proyectos</h5>
          </Card.Header>
          <Card.Body
            style={{
              padding: "10px",
              overflow: "auto",
            }}
          >
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th style={{ width: "400px" }}>Titulo</th>
                  <th style={{ width: "1000px" }}>Contenido</th>
                  <th style={{ width: "120px" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td
                      style={{
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.title}
                    </td>
                    <td
                      style={{
                        maxWidth: "300px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.content}
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(item)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        <div style={{ width: "35%" }}>
          <TextDataFetcher userId={localStorage.getItem("id")} />
        </div>
      </div>

      <button
        style={{
          position: "fixed",
          bottom: "1cm",
          right: "1cm",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          cursor: "pointer",
          transition: "transform 0.2s, box-shadow 0.2s",
          zIndex: 1000,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
        }}
        onClick={() => setShowAddModal(true)}
      >
        <FaPlus size={24} />
      </button>

      {/* Los modales permanecen igual */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nuevo Dato</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Titulo</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contenido</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => setShowAddModal(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Adicionar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Datos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Titulo</Form.Label>
              <Form.Control
                type="text"
                value={editingItem?.title || ""}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, title: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contenido</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editingItem?.content || ""}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, content: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Modificar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default DataManagement;
