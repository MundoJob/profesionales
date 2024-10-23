import React, { useState, useEffect, useRef } from "react";
import "./modal.css";
import Swal from "sweetalert2";

const ModalFechas = ({
  closeFechas,
  handleDate,
  fechaFormateada,
  fecha,
  pp,
  selectedUsers,
  setUltimaVista,
}) => {
  const modalRef = useRef(null);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setMinDate(today);
    setMaxDate(fecha);

    console.log("Fecha mínima:", today);
    console.log("Fecha máxima:", fecha);
  }, [fecha]);

  const handleModalClick = (event) => {
    if (!modalRef.current.contains(event.target)) {
      closeFechas();
    }
  };

  const handleDateChange = (event) => {
    const newSelectedDate = event.target.value;
    setSelectedDate(newSelectedDate);
    handleDate(newSelectedDate);
  };

  const handleContinue = () => {
    if (selectedDate) {
      setUltimaVista(true);
    } else {
      Swal.fire({
        title: "¡Atención!",
        text: "Por favor, seleccione una fecha antes de continuar.",
        icon: "warning",
        confirmButtonText: "Entendido",
      });
    }
  };

  const encontrado = selectedUsers.some(
    (user) => user.Sociedad_de_facturacion === "España" && pp !== "España"
  );

  return (
    <div className="fechasContainer" onClick={handleModalClick}>
      <div className="modal" ref={modalRef}>
        <div>
          <h2>Ingrese las fechas</h2>
          <p className="fechaFinal">
            Fecha final de entrega: {fechaFormateada}
          </p>
        </div>

        <div>
          <input
            type="date"
            name=""
            id=""
            min={minDate}
            max={maxDate}
            onChange={handleDateChange}
            value={selectedDate}
          />
        </div>
        {encontrado ? (
          <div style={{ color: "red" }}>
            Está por asignar un proyecto de LATAM para uno o más profesionales
            de España.
          </div>
        ) : null}
        <div className="botonera">
          <div>
            <button className="cerrar-fechas" onClick={() => closeFechas()}>
              Cerrar
            </button>
          </div>
          <div>
            <button onClick={handleContinue}>Continuar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalFechas;
