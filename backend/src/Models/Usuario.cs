using System;
using System.Collections.Generic;

namespace CapibaCultural.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Senha { get; set; }
        public int SaldoMoedaCapiba { get; set; }
        public DateTime DataCadastro { get; set; } = DateTime.Now;

        public List<Caravana> Caravanas { get; set; } = new();
        public List<GrupoCompeticao> Grupos { get; set; } = new();
    }
}