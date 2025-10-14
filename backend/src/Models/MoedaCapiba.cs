public class MoedaCapiba
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public Usuario Usuario { get; set; }
    public int Quantidade { get; set; }
    public DateTime DataCredito { get; set; }
    public string Motivo { get; set; }
}