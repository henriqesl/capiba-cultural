using System.Diagnostics.Tracing;

public class Caravana
{
    public int Id { get; set; }
    public int EventoId { get; set; }
    public Evento Evento { get; set; }
    public List<Usuario> Participantes { get; set; } = new();
    public int BonusPorParticipante { get; set; }

    public void AdicionarParticipantes (Usuario usuario)
    {
        Participantes.Add(usuario);
        usuario.SaldoMoedaCapiba += BonusPorParticipante;
    }
}