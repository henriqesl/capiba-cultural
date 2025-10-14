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
        public bool PorteDoEvento { get; set; }
        public int Participantes { get; set; }
        public int MoedasDistribuidas { get; set; }

        public List<Caravana> Caravanas { get; set; } = new();
    }
}