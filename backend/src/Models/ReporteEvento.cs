using System;

namespace CapibaCultural.Models
{
    public class ReporteEvento
    {
        public int Id { get; set; }
        public Usuario Reportante { get; set; }
        public Evento Evento { get; set; }
        public DateTime DataReporte { get; set; } = DateTime.Now;
        public string Descricao { get; set; }

        public ReporteEvento() {}

        public ReporteEvento(Usuario reportante, Evento evento, string descricao)
        {
            Reportante = reportante ?? throw new ArgumentException("Reportante inválido.");
            Evento = evento ?? throw new ArgumentException("Evento inválido.");
            Descricao = descricao ?? string.Empty;
        }
    }
}