import React from "react";
import "./filtro.css";
import DropdownFilter from "../Drodowns/DropdownFilter";

const Filtro = ({
  filters,
  filtros,
  setFilters,
  onClose,
  coord,
  handleClean,
}) => {
  console.log(filtros);
  return (
    <div className="filter-popup">
      <div className="filter-popup-content">
        <div className="filter-header">
          <div className="box2">
            <h2>Aplique los filtros</h2>
            <button
              className="btn-filtros-filtros"
              onClick={() => {
                handleClean();
              }}
            >
              Limpiar filtros
            </button>
          </div>
          <button className="close-filtros" onClick={onClose}>
            Cerrar
          </button>
        </div>

        <div className="filter-body">
          {/* <DropdownFilter
            title="Carrera"
            options={filtros.carreras}
            selectedOptions={filters.carrera}
            onChange={(selected) =>
              setFilters({ ...filters, carrera: selected })
            }
          />

          <DropdownFilter
            title="Especialidad"
            options={filtros.especialidades}
            selectedOptions={filters.especialidad}
            onChange={(selected) =>
              setFilters({ ...filters, especialidad: selected })
            }
          /> */}
          <DropdownFilter
            title="Convocatoria"
            options={filtros.convocatorias}
            selectedOptions={filters.convocatoria}
            onChange={(selected) =>
              setFilters({ ...filters, convocatoria: selected })
            }
          />
          <DropdownFilter
            title="Estado"
            options={filtros.estados}
            selectedOptions={filters.estado}
            onChange={(selected) =>
              setFilters({ ...filters, estado: selected })
            }
          />

          <DropdownFilter
            title="Departamento"
            options={filtros.departamentos}
            selectedOptions={filters.departamento}
            onChange={(selected) =>
              setFilters({ ...filters, departamento: selected })
            }
          />

          <DropdownFilter
            title="País"
            options={filtros.paises}
            selectedOptions={filters.pais}
            onChange={(selected) => setFilters({ ...filters, pais: selected })}
          />
          <DropdownFilter
            title="Idioma"
            options={filtros.idiomas}
            selectedOptions={filters.idioma}
            onChange={(selected) =>
              setFilters({ ...filters, idioma: selected })
            }
          />

          {/* <label className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.haHechoProyectos}
              onChange={(e) =>
                setFilters({ ...filters, haHechoProyectos: e.target.checked })
              }
            />
            ¿Ha hecho proyectos antes?
          </label> */}
        </div>
      </div>
    </div>
  );
};

export default Filtro;
