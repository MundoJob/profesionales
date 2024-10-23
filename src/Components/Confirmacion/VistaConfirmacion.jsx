import React, { useState } from "react";
import Cargando from "../VistaCargaFinal/Cargando";

const VistaConfirmacion = ({
  selectedUsers,
  registro,
  fechaFormateada,
  closeWidget,
  setUltimaVista,
  handleConfirm,
  cargando,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = selectedUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(selectedUsers.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="profesionales-container">
      <div className="header">
        <h1>{registro.Name}</h1>
        <div className="header-info">
          <div>
            <p>Carrera: {registro.carrera}</p>
            <p>País: {registro.Pa_s_de_procedencia}</p>
          </div>
          <div>
            <p>Fecha Final de Entrega: {fechaFormateada}</p>
            <p>Páginas: {registro.Numero_de_Paginas}</p>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="profesionales-table">
          <thead>
            <tr>
              <th></th>
              <th>Nombre</th>
              <th>Carrera</th>
              <th>Especialidad</th>
              <th>Nacionalidad</th>
              <th>Facturación</th>
              <th>Departamento</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((profesional) => (
              <tr key={profesional.id}>
                <td></td>
                <td>{profesional.Vendor_Name}</td>
                <td>{profesional.Carrera_1}</td>
                <td>{profesional.Especialidad}</td>
                <td>{profesional.Nacionalidad}</td>
                <td>{profesional.Sociedad_de_facturacion}</td>
                <td>{profesional.Departamento.join(", ")}</td>
                <td>{profesional.Estado_del_Profesional}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="footer">
        <div className="primerContenedorFooter">
          <div>
            <div>
              <button style={{ backgroundColor: "transparent" }}></button>
            </div>
            <button
              className="filtros-btn"
              onClick={() => setUltimaVista(false)}
            >
              ATRAS{" "}
            </button>
          </div>
        </div>
        <div className="contador">
          <div className="box1">
            <p>Seleccionados:</p>
            <p className="cantidad">{selectedUsers.length}</p>
          </div>
        </div>
        <div className="action-buttons">
          <div className="pagination">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={100}>100</option>
              <option value={50}>50</option>
              <option value={25}>25</option>
            </select>
            <span>
              {indexOfFirstItem + 1}–
              {Math.min(indexOfLastItem, selectedUsers.length)} of{" "}
              {selectedUsers.length}
            </span>
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              &lt;
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
          <button onClick={closeWidget} className="cerrar-btn">
            CERRAR
          </button>
          <button className="btn-confirmar" onClick={() => handleConfirm()}>
            CONFIRMAR
          </button>
        </div>
      </div>
      {cargando ? <Cargando /> : null}
    </div>
  );
};

export default VistaConfirmacion;
