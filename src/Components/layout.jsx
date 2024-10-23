import React, { useState, useEffect } from "react";
import "./layout.css";
import ModalFechas from "./ModalFechas/ModalFechas";
import Filtro from "./Filtros/Filtro";
import VistaConfirmacion from "./Confirmacion/VistaConfirmacion";
import {
  closeWidget,
  filtrarProfesionales,
  normalize,
} from "../Functions/functions";

const Layout = ({ registerID, registro, datos }) => {
  const [cargando, setCargando] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectAll, setSelectAll] = useState(false);
  const [modalUsers, setModalUsers] = useState(false);
  const [ultmaVista, setUltimaVista] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(200);
  const [profesionales, setProfesionales] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [filters, setFilters] = useState({
    carrera: [],
    especialidad: [],
    departamento: registro.Coord ? [registro.Coord] : [],
    pais: [],
    idioma: [],
    haHechoProyectos: false,
    estado: [],
    convocatoria: [],
  });
  const [filtros, setFiltros] = useState({
    carreras: [],
    especialidades: [],
    departamentos: [],
    paises: [],
    idiomas: [],
    estados: [],
    convocatorias: [],
  });
  const tag =
    datos && datos.Tag && datos.Tag.some((item) => item.name === "Urgente")
      ? "Urgente"
      : null;

  useEffect(() => {
    const fetchProfesionales = async (pais) => {
      setIsLoading(true);

      let allProfesionales = [];

      const fetchData = async (offset) => {
        const config = {
          select_query: `select Vendor_Name,Bloquear_profesional_en_el_asignar,Valor_por_pagina,Convocatoria, Carrera_1,Pa_s_de_residencia, Especialidad, Departamento, Sociedad_de_facturacion,Programas,Estado_del_Profesional, Idioma from Vendors where Estado_del_Profesional = 'Activo' OR Estado_del_Profesional = 'Por Asignar'  LIMIT 200 OFFSET ${offset}`,
        };

        try {
          const data = await window.ZOHO.CRM.API.coql(config);
          const listProfesionales = data.data.map((prof) => ({
            ...prof,
            specialityList: prof.Especialidad
              ? prof.Especialidad.split(";")
              : [],
          }));
          const filteredProfesionales = listProfesionales.filter(
            (prof) => prof.Bloquear_profesional_en_el_asignar !== "SI"
          );

          allProfesionales = [...allProfesionales, ...filteredProfesionales];

          if (data.info.more_records) {
            await fetchData(offset + 200);
          } else {
            setProfesionales(allProfesionales);

            const uniqueCarreras = [
              ...new Set(allProfesionales.map((prof) => prof.Carrera_1)),
            ].filter(Boolean);
            const uniqueEspecialidades = [
              ...new Set(
                allProfesionales.flatMap((prof) => prof.specialityList)
              ),
            ].filter(Boolean);
            const uniqueDepartamentos = [
              ...new Set(allProfesionales.flatMap((prof) => prof.Departamento)),
            ].filter(Boolean);
            const uniquePaises = [
              ...new Set(
                allProfesionales.map((prof) => prof.Pa_s_de_residencia)
              ),
            ].filter(Boolean);
            const uniqueIdiomas = [
              ...new Set(allProfesionales.flatMap((prof) => prof.Idioma || [])),
            ].filter(Boolean);
            const uniqueEstados = [
              ...new Set(
                allProfesionales.flatMap(
                  (prof) => prof.Estado_del_Profesional || []
                )
              ),
            ].filter(Boolean);
            const uniqueConvocatorias = [
              ...new Set(
                allProfesionales.flatMap((prof) => prof.Convocatoria || [])
              ),
            ].filter(Boolean);

            setFiltros((prevFiltros) => ({
              ...prevFiltros,
              carreras: uniqueCarreras,
              especialidades: uniqueEspecialidades,
              departamentos: uniqueDepartamentos,
              paises: uniquePaises,
              idiomas: uniqueIdiomas,
              estados: uniqueEstados,
              convocatorias: uniqueConvocatorias,
            }));

            setIsLoading(false);
          }
        } catch (error) {
          console.error("Error fetching and processing data:", error);
          setIsLoading(false);
        }
      };

      await fetchData(0);
    };

    if (registro.Coord) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        departamento: [registro.Coord.toUpperCase()],
      }));
    }
    fetchProfesionales();
  }, [registro.Coord]);

  const profesionalesFiltrados = filtrarProfesionales(profesionales, filters);
  const porBusqueda = profesionalesFiltrados.filter((profesional) => {
    const normalizedVendorName = normalize(
      (profesional.Vendor_Name || "").toLowerCase()
    );
    const normalizedProgramas = normalize(
      (profesional.Programas || "").toLowerCase()
    );
    const normalizedCarrera = normalize(
      (profesional.Carrera_1 || "").toLowerCase()
    );
    const normalizedEspecialidad = normalize(
      (profesional.Especialidad || "").toLowerCase()
    );
    const normalizedSearchTerm = normalize(searchTerm.toLowerCase());

    return (
      normalizedVendorName.includes(normalizedSearchTerm) ||
      normalizedProgramas.includes(normalizedSearchTerm) ||
      normalizedCarrera.includes(normalizedSearchTerm) ||
      normalizedEspecialidad.includes(normalizedSearchTerm)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(porBusqueda.length / itemsPerPage);

  const sortProfesionales = (profesionales) => {
    return [...profesionales].sort((a, b) => {
      const aSelected = selectedUsers.some((user) => user.id === a.id);
      const bSelected = selectedUsers.some((user) => user.id === b.id);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });
  };

  const currentItems = sortProfesionales(porBusqueda).slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    const allCurrentItemsSelected = currentItems.every((item) =>
      selectedUsers.some((selected) => selected.id === item.id)
    );
    setSelectAll(allCurrentItemsSelected);
  }, [currentItems, selectedUsers]);

  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      const newSelectedUsers = [
        ...selectedUsers.filter(
          (user) => !currentItems.some((item) => item.id === user.id)
        ),
        ...currentItems,
      ];
      setSelectedUsers(newSelectedUsers);
    } else {
      const newSelectedUsers = selectedUsers.filter(
        (user) => !currentItems.some((item) => item.id === user.id)
      );
      setSelectedUsers(newSelectedUsers);
    }
  };

  const handleSelectUser = (event, user) => {
    const isChecked = event.target.checked;
    let newSelectedUsers;

    if (isChecked) {
      newSelectedUsers = [...selectedUsers, user];
    } else {
      newSelectedUsers = selectedUsers.filter(
        (selectedUser) => selectedUser.id !== user.id
      );
    }

    setSelectedUsers(newSelectedUsers);

    const allCurrentItemsSelected = currentItems.every((item) =>
      newSelectedUsers.some((selected) => selected.id === item.id)
    );
    setSelectAll(allCurrentItemsSelected);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleDate = (fecha) => {
    setFechaSeleccionada(fecha);
  };

  const handleClean = () => {
    setFilters({
      carrera: [],
      especialidad: [],
      departamento: [],
      pais: [],
      idioma: [],
      haHechoProyectos: false,
      estado: [],
      convocatoria: [],
    });
  };

  const handleConfirm = () => {
    setCargando(true);
    try {
      const data = {
        Fecha_para_el_Profesional1: fechaSeleccionada,
        Fecha_para_el_Profesional: fechaSeleccionada,
      };

      const argumentsString = JSON.stringify({
        idCoordination: registerID,
        professionalList: selectedUsers.map((prof) => prof.id),
        data,
      });

      window.ZOHO.CRM.FUNCTIONS.execute("handleProfessionalsConfirm", {
        arguments: argumentsString,
      });
    } catch (error) {
      console.log(error);
    }

    setTimeout(() => {
      window.ZOHO.CRM.BLUEPRINT.proceed();
    }, 3000);
  };

  const formatearFecha = (fecha) => {
    const [anno, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${anno.slice(2)}`;
  };

  const closeFechas = () => {
    setUltimaVista(false);
    setModalUsers(false);
  };

  const fechaFormateada =
    registro.length !== 0
      ? formatearFecha(registro.Fecha_Final_de_Entrega)
      : null;

  const handleDeselectAll = () => {
    setSelectedUsers([]);
    setSelectAll(false);
  };
  return (
    <>
      {ultmaVista === false ? (
        <div className="profesionales-container">
          <div className="header">
            <div className="cont-tag">
              <h1>{registro.Name}</h1>
              {tag === "Urgente" ? (
                <div class="boton-urgente">
                  {tag} <span class="cerrar"></span>
                </div>
              ) : null}
            </div>
            <div className="arreglo">
              <p>
                Carrera: <strong>{registro.Carrera}</strong>
              </p>
              <p>
                País: <strong>{registro.Pa_s_de_procedencia}</strong>
              </p>
              <p>
                Páginas:<strong> {registro.Numero_de_Paginas}</strong>
              </p>
              <p>
                Fecha Final de Entrega: <strong> {fechaFormateada}</strong>
              </p>
            </div>
          </div>

          <div className="table-container">
            {isLoading ? (
              <div className="loader-container">
                <div className="loader"></div>
              </div>
            ) : (
              <table className="profesionales-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>Nombre</th>
                    <th>Carrera</th>
                    <th>Especialidad</th>
                    <th>Estado</th>
                    <th>Facturación</th>
                    <th>Departamento</th>
                    <th>Valor de pagina</th>
                    <th>Programas</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((profesional) => (
                    <tr key={profesional.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedUsers.some(
                            (user) => user.id === profesional.id
                          )}
                          onChange={(e) => handleSelectUser(e, profesional)}
                        />
                      </td>
                      <td>{profesional.Vendor_Name}</td>
                      <td>{profesional.Carrera_1}</td>
                      <td title={profesional.Especialidad}>
                        {profesional.Especialidad}
                      </td>
                      <td>{profesional.Estado_del_Profesional}</td>
                      <td>{profesional.Sociedad_de_facturacion}</td>
                      <td title={profesional.Departamento}>
                        {profesional.Departamento.join(", ")}
                      </td>
                      <td>{profesional.Valor_por_pagina}</td>
                      <td>{profesional.Programas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="footer">
            <div className="primerContenedorFooter">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Buscar por nombre/Programa/carrera/especialidad"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>

              <div>
                <button
                  className="filtros-btn"
                  onClick={() => setShowFilters(true)}
                >
                  FILTROS
                </button>
                <button className="limpiar-btn" onClick={() => handleClean()}>
                  LIMPIAR
                </button>
              </div>
            </div>
            <div className="contador">
              <div className="box1">
                <p>Seleccionados:</p>
                <p className="cantidad">{selectedUsers.length}</p>
              </div>
              <div>
                <button
                  className="deselect-all-btn"
                  onClick={handleDeselectAll}
                >
                  Deseleccionar todos
                </button>
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
                  <option value={200}>200</option>
                  <option value={100}>100</option>
                  <option value={50}>50</option>
                  <option value={25}>25</option>
                </select>
                <span>
                  {indexOfFirstItem + 1}–
                  {Math.min(indexOfLastItem, porBusqueda.length)} of{" "}
                  {porBusqueda.length}
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
              <button
                onClick={() => setModalUsers(true)}
                className={`elegir-fechas-btn ${
                  selectedUsers.length > 0 ? "btn-active" : "btn-disabled"
                }`}
                disabled={selectedUsers.length === 0}
              >
                ELEGIR FECHAS
              </button>
            </div>
          </div>

          {modalUsers ? (
            <ModalFechas
              closeFechas={closeFechas}
              handleDate={handleDate}
              fechaFormateada={fechaFormateada}
              fecha={registro.Fecha_Final_de_Entrega}
              pp={registro.Pa_s_de_procedencia}
              selectedUsers={selectedUsers}
              setUltimaVista={setUltimaVista}
            />
          ) : null}
          {showFilters && (
            <Filtro
              filtros={filtros}
              filters={filters}
              setFilters={setFilters}
              onClose={() => setShowFilters(false)}
              coord={registro.Coord}
              handleClean={handleClean}
            />
          )}
        </div>
      ) : (
        <VistaConfirmacion
          selectedUsers={selectedUsers}
          registro={registro}
          fechaFormateada={fechaFormateada}
          closeWidget={closeWidget}
          setUltimaVista={setUltimaVista}
          handleConfirm={handleConfirm}
          cargando={cargando}
        />
      )}
    </>
  );
};

export default Layout;
