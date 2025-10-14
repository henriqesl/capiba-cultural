using System;
using System.Collections.Generic;

namespace CapibaCultura.Models
{
    public class Caravana
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public int EventoId { get; set; }
        public Evento EventoDestino { get; set; }
        public List<Usuario> Membros { get; set; } = new();
        public int BonusPorParticipante { get; set; } = 10;

        public Caravana() { }

        public Caravana(string nome, Evento evento)
        {
            Nome = nome;
            EventoDestino = evento;

        }
        public void AdicionarMembro(Usuario usuario)
        {
            Membros.Add(usuario);
            usuario.AdicionarMoedas(BonusPorParticipante);
        }
    }
}