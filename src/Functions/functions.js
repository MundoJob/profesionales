export const filtrarProfesionales = (profesionales, filters) => {
  console.log(filters);
  let resultadosFiltrados = profesionales;

  // 1. Filtrar por Departamento
  if (filters.departamento && filters.departamento.length > 0) {
    resultadosFiltrados = profesionales.filter((profesional) =>
      filters.departamento.some((departamento) =>
        profesional.Departamento.includes(departamento)
      )
    );
  }

  // 2. Filtrar por Carrera y Especialidad (no excluyentes, pero sobre el filtro de Departamento)
  let filtroCarrera = [];
  let filtroEspecialidad = [];

  if (filters.carrera && filters.carrera.length > 0) {
    filtroCarrera = resultadosFiltrados.filter((profesional) =>
      filters.carrera.includes(profesional.Carrera_1)
    );
  }

  if (filters.especialidad && filters.especialidad.length > 0) {
    filtroEspecialidad = resultadosFiltrados.filter((profesional) =>
      filters.especialidad.some((esp) =>
        profesional.specialityList.includes(esp)
      )
    );
  }

  // Combinar los resultados de Carrera y Especialidad
  if (filtroCarrera.length > 0 || filtroEspecialidad.length > 0) {
    resultadosFiltrados = [
      ...new Set([...filtroCarrera, ...filtroEspecialidad]),
    ];
  }

  // 3. Filtrar por País e Idioma (excluyentes)
  if (filters.pais && filters.pais.length > 0) {
    resultadosFiltrados = resultadosFiltrados.filter((profesional) =>
      filters.pais.includes(profesional.Sociedad_de_facturacion)
    );
  }

  if (filters.estado && filters.estado.length > 0) {
    console.log("aqui");
    resultadosFiltrados = resultadosFiltrados.filter((profesional) =>
      filters.estado.some((departamento) =>
        profesional.Estado_del_Profesional.includes(departamento)
      )
    );
  }
  if (filters.convocatoria && filters.convocatoria.length > 0) {
    const convocatoriaFiltrada = filters.convocatoria.filter(
      (departamento) => departamento !== null
    );
    resultadosFiltrados = resultadosFiltrados.filter((profesional) =>
      convocatoriaFiltrada.some(
        (departamento) =>
          profesional.Convocatoria &&
          profesional.Convocatoria.includes(departamento)
      )
    );
  }

  if (filters.idioma && filters.idioma.length > 0) {
    resultadosFiltrados = resultadosFiltrados.filter((profesional) => {
      const idiomasProfesional = Array.isArray(profesional.Idioma)
        ? profesional.Idioma
        : [profesional.Idioma];
      return filters.idioma.some((idiomaFiltro) =>
        idiomasProfesional.includes(idiomaFiltro)
      );
    });
  }
  console.log(resultadosFiltrados);
  return resultadosFiltrados;
};

export const normalize = (text) => {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};
export const closeWidget = () => {
  window.ZOHO.CRM.UI.Popup.close();
};
