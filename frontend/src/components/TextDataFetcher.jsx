import React, { useState } from "react";
import axios from "axios";
import { Card, Spinner, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { RefreshCw as RefreshIcon, Save as SaveIcon } from "react-feather";
import { Tooltip } from "react-tooltip";

export function TextDataFetcher({ userId }) {
  const [fetchedText, setFetchedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchTextData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      const response = await axios.get(
        `http://localhost:3000/api/data/obtener/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
      const data = response.data;
      const mensaje = `Estos son los proyectos que he llevado en mi carrera universitaria:\n${data
        .map(
          (proyecto, index) =>
            `${index + 1}. Proyecto: ${proyecto.title}\n   Descripción: ${
              proyecto.content
            } recomiendame temas de tesis que puedo hacer para finalizar mis estudios`
        )
        .join("\n\n")}`;

      console.log("mensaje", mensaje);
      const apiIA = await axios.post(
        "https://service-for-tesis.onrender.com/ask",
        {
          text: mensaje,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(apiIA.data.response);
      setFetchedText(apiIA.data.response);
    } catch (error) {
      toast.error("Error al generar los temas de tesis");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTextData = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      await axios.post(
        "http://localhost:3000/api/data/guardar",
        {
          id: id,
          datos: fetchedText,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Texto guardado exitosamente");
    } catch (error) {
      toast.error("Error al guardar los datos de texto");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card style={{ height: "100%" }}>
      <Card.Header>
        <h5 style={{ fontSize: "1rem" }}>Temas de tesis recomendados</h5>
      </Card.Header>

      <Card.Body
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          position: "relative",
        }}
      >
        <div style={{ position: "relative" }}>
          <div
            style={{
              overflowY: "auto",
              maxHeight: "370px", // Ajusta la altura máxima según sea necesario
              backgroundColor: "#f8f9fa",
              padding: "1rem",
              borderRadius: "4px",
              fontSize: "0.9rem",
              marginRight: "1px",
            }}
            dangerouslySetInnerHTML={{
              __html: fetchedText
                ? fetchedText.replace(/\n/g, "<br />")
                : "No hay texto para mostrar",
            }}
          />

          <div
            style={{
              position: "absolute",
              right: "-35px", // Aumentado de -20px a -35px
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <Button
              id="refresh-btn"
              onClick={fetchTextData}
              disabled={isLoading}
              variant="primary"
              size="sm"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.4rem 0.3rem",
                width: "25px",
                height: "25px",
              }}
            >
              {isLoading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                <RefreshIcon size={16} />
              )}
            </Button>

            <Tooltip anchorId="refresh-btn" content="Generar Temas" />

            <Button
              id="save-btn"
              onClick={saveTextData}
              disabled={isSaving || !fetchedText}
              variant="success"
              size="sm"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.2rem 0.2rem",
                width: "25px",
                height: "25px",
              }}
            >
              {isSaving ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                <SaveIcon size={16} />
              )}
            </Button>

            <Tooltip anchorId="save-btn" content="Guardar Texto" />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
