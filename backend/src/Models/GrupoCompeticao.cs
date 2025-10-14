using System;
using System.Collections.Generic;
using System.Linq;

namespace CapibaCultural.Models
{
    public class GrupoCompeticao
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public List<Usuario> Membros { get; set; } = new();
        public DateTime DataInicio { get; set; }
        public DateTime DataFim { get; set; }

        public GrupoCompeticao() {}

        public GrupoCompeticao(string nome, DateTime inicio, DateTime fim)
        {
            Nome = nome;
            DataInicio = inicio;
            DataFim = fim;
        }

        public void AdicionarMembro(Usuario usuario)
        {
            Membros.Add(usuario);
        }

        public Usuario ObterVencedor()
        {
            return Membros.OrderByDescending(m => m.SaldoMoedaCapiba).FirstOrDefault();
        }
    }
}