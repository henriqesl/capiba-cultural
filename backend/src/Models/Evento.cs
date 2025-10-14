using System;
using System.Collections.Generic;

namespace CapibaCultural.Models
{
    public class Evento
    {
        public int ID { get; set; }
        public string Nome { get; set; }
        public DateTime Data { get; set; }
        public string Local { get; set; }
        public bool Ativo { get; set; } = true;
        public bool AoVivo { get; set; }
        public bool IsPequenoPorte { get; set; }
        public int Participantes { get; set; }
        public int MoedasDistribuidas { get; set; }

        public List<Caravana> Caravanas { get; set; } = new();

        public Evento() { }

        public Evento(string nome, string local, DateTime data, string descricao, bool pequenoPorte = false)
        {
            Nome = nome;
            Local = local;
            Data = data;
            Descricao = descricao;
            IsPequenoPorte = pequenoPorte;
        }
        
        public void AdicionarParticipante(Usuario usuario)
        {
            Participantes.Add(usuario);
        }
    }
}