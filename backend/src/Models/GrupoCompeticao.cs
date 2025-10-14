public class GrupoCompeticao
{
    public int Id { get; set; }
    public string Nome { get; set; }
    public List<Usuario> Membros { get; set; } = new();
    public int Pontuacao { get; set; }
    public int Premio { get; set; }

    public void AtualizarPontuacao()
    {
        Pontuacao = Membros.Sum(u => u.SaldoMoedaCapiba);
    }
}