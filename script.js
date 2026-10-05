const API = "https://pokeapi.co/api/v2/pokemon/";
async function buscarPokemon() {
    const campo = document.getElementById("pokemon");
    const nomePokemon = campo.value.trim().toLowerCase();
    const resultado = document.getElementById("resultado");
    const erro = document.getElementById("erro");
    if (nomePokemon === "") {
        erro.textContent = "Digite o nome de um Pokémon.";
        resultado.classList.add("d-none");
        return;
    }
    erro.textContent = "";
    try {
        const resposta = await fetch(API + nomePokemon);
        if (!resposta.ok) {
            throw new Error("Pokémon não encontrado.");
        }
        const pokemon = await resposta.json();
        console.log(pokemon);
        document.getElementById("nome").textContent =
            `${capitalizar(pokemon.name)} #${pokemon.id}`;
        document.getElementById("imagem").src =
            pokemon.sprites.front_default;
        document.getElementById("imagem").alt =
            capitalizar(pokemon.name);
        document.getElementById("tipo").textContent =
            capitalizar(pokemon.types[0].type.name);
        document.getElementById("altura").textContent =
            `${pokemon.height / 10} m`;
        document.getElementById("peso").textContent =
            `${pokemon.weight / 10} kg`;
        const hp = pegarStatus(pokemon, "hp");
        const ataque = pegarStatus(pokemon, "attack");
        const defesa = pegarStatus(pokemon, "defense");
        const velocidade = pegarStatus(pokemon, "speed");
        colocarStatus("hp", hp);
        colocarStatus("ataque", ataque);
        colocarStatus("defesa", defesa);
        colocarStatus("velocidade", velocidade);
        const habilidades = document.getElementById("habilidades");
        habilidades.innerHTML = "";
        pokemon.abilities.forEach(item => {
            const habilidade = document.createElement("span");
            habilidade.classList.add("badge", "text-bg-secondary");
            habilidade.textContent =
                capitalizar(
                    item.ability.name.replace("-", " ")
                );
            habilidades.appendChild(habilidade);
        });
        resultado.classList.remove("d-none");
    } catch (error) {
        console.error(error);
        erro.textContent =
            "Pokémon não encontrado. Verifique o nome e tente novamente.";
        resultado.classList.add("d-none");
    }
}
function pegarStatus(pokemon, nome) {
    const status = pokemon.stats.find(
        item => item.stat.name === nome
    );
    return status ? status.base_stat : 0;
}
function colocarStatus(nome, valor) {
    document.getElementById(nome + "Valor").textContent = valor;
    const barra = document.getElementById(nome + "Bar");
    const porcentagem = Math.min(valor, 100);
    barra.style.width = porcentagem + "%";
    barra.textContent = valor;
    barra.setAttribute("aria-valuenow", valor);
    barra.setAttribute("aria-valuemin", "0");
    barra.setAttribute("aria-valuemax", "100");
}
function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}
document.getElementById("pokemon").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        buscarPokemon();
    }
});
buscarPokemon();