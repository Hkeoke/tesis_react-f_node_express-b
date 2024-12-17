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
      setSuccess("Datos adicionados con exito");
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
      setSuccess("Datos eliminados con exito");
      fetchData();
    } catch (err) {
      setError("FNo se pudo eliminar los datos");
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
      setSuccess("Datos actualizados con exito");
      setShowEditModal(false);
      fetchData();
    } catch (err) {
      setError("Nos se pudo actualizar los datos");
    }
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "5rem 1cm", // 1cm margin from browser edges
      }}
    >
      <h2 className="mb-3">Manejo de Datos</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card
        className="px-5"
        style={{
          width: "100%",
          flex: 4,
          display: "flex",
          flexDirection: "column",
          minHeight: "100%",
          minWidth: "100%",
        }}
      >
        <Card.Header>
          <h5 className="mb-6 md-6 px-6">Lista de Datos</h5>
        </Card.Header>
        <Card.Body
          style={{
            flex: 1,
            minHeight: 0,
            padding: "5mm", // 5mm padding inside the card
          }}
        >
          <div
            style={{
              height: "100%",
              overflow: "auto",
            }}
          >
            <Table striped bordered hover style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th style={{ minWidth: "400px" }}>Titulo</th>
                  <th style={{ minWidth: "300px" }}>Contenido</th>
                  <th style={{ minWidth: "120px", width: "120px" }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td
                      style={{
                        maxWidth: "200px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={item.title}
                    >
                      {item.title}
                    </td>
                    <td
                      style={{
                        maxWidth: "300px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={item.content}
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
          </div>
        </Card.Body>
      </Card>

      {/* Floating Action Button */}
      <button
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
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

      {/* Add Modal */}
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

      {/* Edit Modal */}
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
    </div>
  );
}

export default DataManagement;
