//"Banco de dados dos eventos"


const mockEventsData = [
    { 
        id: 1, 
        title: "Show de Rock Nacional", 
        time: "20:00 - 23:00", 
        location: "Clube Metrópole",
        description: "Uma noite incrível com as melhores bandas de rock nacional, celebrando os clássicos que marcaram gerações.",
        needsRegistration: true,
        age: 18,
        price: "R$ 80,00"
    },
    { 
        id: 2, 
        title: "Festival de Jazz & Blues", 
        time: "18:00 - 22:00", 
        location: "Pátio de São Pedro", 
        description: "Deixe-se levar pelos sons suaves do saxofone e da guitarra. Um evento ao ar livre.",
        needsRegistration: false,
        age: 0, // 0 = Livre
        price: "Gratuito"
    },
    { 
        id: 3, 
        title: "Peça Teatral 'O Auto da Compadecida'", 
        time: "19:30 - 21:00", 
        location: "Teatro de Santa Isabel",
        description: "A clássica obra de Ariano Suassuna ganha vida no palco.",
        needsRegistration: true,
        age: 12,
        price: "R$ 40,00"
    },
    { 
        id: 4, 
        title: "Exposição de Arte Moderna", 
        time: "09:00 - 17:00", 
        location: "Instituto Ricardo Brennand",
        description: "Explore as obras de artistas renomados do século 20.",
        needsRegistration: false,
        age: 0,
        price: "R$ 30,00"
    },
    { 
        id: 5, 
        title: "Roda de Samba do Grupo Bom Gosto", 
        time: "14:00 - 17:00", 
        location: "Rua da Moeda",
        description: "O melhor do samba de raiz no coração do Recife Antigo.",
        needsRegistration: false,
        age: 0,
        price: "Gratuito"
    },
    { 
        id: 6, 
        title: "Exposição de Arte Antiga", 
        time: "09:00 - 17:00", 
        location: "Instituto Francisco Brennand",
        description: "Uma viagem no tempo através de esculturas e pinturas clássicas.",
        needsRegistration: false,
        age: 0,
        price: "R$ 30,00"
    }
];

export default EventsData;