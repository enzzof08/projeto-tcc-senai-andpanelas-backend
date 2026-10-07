create database db_entre_panelas_2026;

use db_entre_panelas_2026;

#drop database db_entre_panelas_2026;

create table tbl_usuario (
	id			    int not null auto_increment primary key,
    nome    	    varchar(150) not null,
    username        varchar(20) not null,
    email		    varchar(256) not null,
    senha		    varchar(255) not null,
    descricao	    varchar(200) not null,
    banner_url      varchar(2000) not null,
    foto_perfil     varchar(2000) not null,
    data_nascimento date not null
);

create table tbl_em_alta (
	id			int not null auto_increment primary key,
    pesquisa	varchar(80) not null,
    data_dia 	date default (current_date)
);

create table tbl_unidade_medida (
	id			int not null auto_increment primary key,
	unidade		varchar(6) not null
);

create table tbl_ingrediente_geladeira (
	id			      int not null auto_increment primary key,
	nome_ingrediente  varchar(35) not null,
    quantidade	      int not null,
    id_usuario		  int not null,
    id_unidade_medida int not null,
    
    constraint FK_USUARIO_INGREDIENTE_GELADEIRA
    foreign key (id_usuario)
    references tbl_usuario(id),
    
    constraint FK_UNIDADE_MEDIDA_INGREDIENTE_GELADEIRA
    foreign key (id_unidade_medida)
    references tbl_unidade_medida(id)
);

create table tbl_seguindo_seguidor (
	id			int not null auto_increment primary key,
	id_seguindo int not null,
    id_seguidor int not null,
    
    constraint FK_USUARIO_SEGUINDO
    foreign key (id_seguindo)
    references tbl_usuario(id),
    
    constraint FK_USUARIO_SEGUIDORES
    foreign key (id_seguidor)
    references tbl_usuario(id)
);

create table tbl_chefinho_conversa (
	id			int not null auto_increment primary key,
	data_hora 	datetime default current_timestamp,
    titulo 		varchar(100) not null,
    id_usuario  int not null,
    
	constraint FK_USUARIO_CHEFINHO_CONVERSA
    foreign key (id_usuario)
    references tbl_usuario(id)
);

create table tbl_mensagem (
	id						int not null auto_increment primary key,
    conteudo				varchar(3000) not null,
    tipo_remetente			varchar(15) not null,
    data_hora				datetime default current_timestamp,
    id_chefinho_conversa  	int not null,
    
	constraint FK_CHEFINHO_CONVERSA_MENSAGEM
    foreign key (id_chefinho_conversa)
    references tbl_chefinho_conversa(id)
);

create table tbl_custo (
	id			int not null auto_increment primary key,
    tipo_custo	varchar(20) not null
);

create table tbl_dificuldade (
	id			int not null auto_increment primary key,
    dificuldade	varchar(30) not null
);

create table tbl_porcao (
	id			    int not null auto_increment primary key,
    numero_porcao	int not null
);

create table tbl_receita (
	id			    int not null auto_increment primary key,
    descricao		varchar(200) not null,
    qtd_curtida		int not null,
    tempo			time not null,
    foto			varchar(2048) not null,
    video			varchar(2083),
    titulo			varchar(50),
    id_custo		int not null,
    id_dificuldade  int not null,
    id_porcao		int not null,
    id_usuario		int not null,
    
    constraint FK_CUSTO_RECEITA
    foreign key (id_custo)
    references tbl_custo(id),
    
	constraint FK_DIFICULDADE_RECEITA
    foreign key (id_dificuldade)
    references tbl_dificuldade(id),
    
	constraint FK_PORCAO_RECEITA
    foreign key (id_porcao)
    references tbl_porcao(id),
    
	constraint FK_USUARIO_RECEITA
    foreign key (id_usuario)
    references tbl_usuario(id)
);

create table tbl_modo_preparo (
	id			    int not null auto_increment primary key,
    metodo_preparo	varchar(250) not null,
    ordem_preparo	int not null,
    id_receita		int not null,
    
    constraint FK_RECEITA_MODO_PREPARO
    foreign key (id_receita)
    references tbl_receita(id)
);

create table tbl_categoria (
	id			    int not null auto_increment primary key,
	categoria		varchar(25) not null
);

create table tbl_receita_categoria (
	id			    int not null auto_increment primary key,
	id_categoria	int not null,
    id_receita	    int not null,
    
    constraint FK_CATEGORIA_RECEITA_CATEGORIA
    foreign key (id_categoria)
    references tbl_categoria(id),
    
	constraint FK_RECEITA_RECEITA_CATEGORIA
    foreign key (id_receita)
    references tbl_receita(id)
);

create table tbl_comentario (
	id			    int not null auto_increment primary key,
	comentario 		varchar(250) not null,
    id_receita		int not null,
    id_usuario		int not null,
    
	constraint FK_RECEITA_COMENTARIO
    foreign key (id_receita)
    references tbl_receita(id),
    
	constraint FK_USUARIO_COMENTARIO
    foreign key (id_usuario)
    references tbl_usuario(id)
);

create table tbl_tag (
	id			int not null auto_increment primary key,
	nome_tag	varchar(30) not null
);

create table tbl_tag_receita (
	id			    int not null auto_increment primary key,
	id_receita		int not null,
    id_tag			int not null,
    
	constraint FK_RECEITA_TAG_RECEITA
    foreign key (id_receita)
    references tbl_receita(id),
    
	constraint FK_TAG_TAG_RECEITA
    foreign key (id_tag)
    references tbl_tag(id)
);

create table tbl_salvo (
	id			int not null auto_increment primary key,
	data_dia 	date default (current_date),
    id_receita  int not null,
    id_usuario  int not null,
    
    constraint FK_RECEITA_SALVO
    foreign key (id_receita)
    references tbl_receita(id),
    
    constraint FK_USUARIO_SALVO
    foreign key (id_usuario)
    references tbl_usuario(id)
);

create table tbl_ingrediente (
	id				  int not null auto_increment primary key,
	nome			  varchar(35) not null,
    quantidade  	  varchar(10) not null,
    id_receita 		  int not null,
    id_unidade_medida int not null,
    
    constraint FK_RECEITA_INGREDIENTES
    foreign key (id_receita)
    references tbl_receita(id),
    
    constraint FK_UNIDADE_MEDIDA_INGREDIENTES
    foreign key (id_unidade_medida)
    references tbl_unidade_medida(id)
);

create table tbl_status (
	id			int not null auto_increment primary key,
	status	    varchar(20) not null
);

create table tbl_lista_compra (
	id				int not null auto_increment primary key,
	id_usuario		int not null,
    id_ingrediente	int not null,
    id_status		int not null,
    
	constraint FK_USUARIO_LISTA_COMPRA
    foreign key (id_usuario)
    references tbl_usuario(id),
    
	constraint FK_INGREDIENTE_LISTA_COMPRA
    foreign key (id_ingrediente)
    references tbl_ingrediente(id),
    
	constraint FK_STATUS_LISTA_COMPRA
    foreign key (id_status)
    references tbl_status(id)
);

create table tbl_categoria_principal (
	id				    int not null auto_increment primary key,
	categoria_principal varchar(50) not null
);

create table tbl_comunidade (
	id						int not null auto_increment primary key,
	foto_url				varchar(2000) not null,
    nome					varchar(80) not null,
    banner_url  			varchar(2000) not null,
    descricao   			varchar(300) not null,
    id_categoria_principal  int not null,
    
	constraint FK_CATEGORIA_PRINCIPAL_COMUNIDADE
    foreign key (id_categoria_principal)
    references tbl_categoria_principal(id)
);

create table tbl_denuncia (
	id				int not null auto_increment primary key,
	data_hora		datetime default current_timestamp,
    motivo			varchar(50) not null,
    detalhe			varchar(200),
    id_usuario		int not null,
    
    constraint FK_USUARIO_DENUNCIA
    foreign key (id_usuario)
    references tbl_usuario(id)
);

create table tbl_denuncia_comunidade (
	id			  int not null auto_increment primary key,
	id_comunidade int not null,
    id_denuncia   int not null,
    
    constraint FK_COMUNIDADE_DENUNCIA_COMUNIDADE
    foreign key (id_comunidade)
    references tbl_comunidade(id),
    
	constraint FK_DENUNCIA_DENUNCIA_COMUNIDADE
    foreign key (id_denuncia)
    references tbl_denuncia(id)
);

create table tbl_denuncia_usuario (
	id			  int not null auto_increment primary key,
	id_usuario    int not null,
    id_denuncia   int not null,
    
    constraint FK_COMUNIDADE_DENUNCIA_USUARIO
    foreign key (id_usuario)
    references tbl_usuario(id),
    
	constraint FK_DENUNCIA_DENUNCIA_USUARIO
    foreign key (id_denuncia)
    references tbl_denuncia(id)
);

create table tbl_denuncia_receita (
	id			  int not null auto_increment primary key,
	id_receita    int not null,
    id_denuncia   int not null,
    
    constraint FK_COMUNIDADE_DENUNCIA_RECEITA
    foreign key (id_receita)
    references tbl_receita(id),
    
	constraint FK_DENUNCIA_DENUNCIA_RECEITA
    foreign key (id_denuncia)
    references tbl_denuncia(id)
);

create table tbl_comunidade_receita (
	id			  int not null auto_increment primary key,
	id_receita    int not null,
    id_comunidade int not null,
    
    constraint FK_RECEITA_COMUNIDADE_RECEITA
    foreign key (id_receita)
    references tbl_receita(id),
    
	constraint FK_COMUNIDADE_COMUNIDADE_RECEITA
    foreign key (id_comunidade)
    references tbl_comunidade(id)
);

create table tbl_comunidade_usuario (
	id			  int not null auto_increment primary key,
	id_comunidade int not null,
    id_usuario    int not null,
    
    constraint FK_COMUNIDADE_COMUNIDADE_USUARIO
    foreign key (id_comunidade)
    references tbl_comunidade(id),
    
	constraint FK_USUARIO_COMUNIDADE_USUARIO
    foreign key (id_usuario)
    references tbl_usuario(id)
);

create table tbl_curtida (
    id         int not null auto_increment primary key,
    id_usuario int not null,
    id_receita int not null,
    date_dia   date default (current_date),

    unique (id_usuario, id_receita),

    constraint FK_USUARIO_CURTIDA
    foreign key (id_usuario)
    references tbl_usuario(id),
    
	constraint FK_RECEITA_CURTIDA
    foreign key (id_receita)
    references tbl_receita(id)
);

create table tbl_catalogo_ingredientes (
	id				  int not null auto_increment primary key,
	nome			  varchar(35) not null
);



insert into tbl_catalogo_ingredientes (ingrediente) values
-- Grãos, cereais e massas
('arroz'),
('arroz integral'),
('arroz arbóreo'),
('arroz parboilizado'),
('feijão'),
('feijão preto'),
('feijão carioca'),
('feijão branco'),
('feijão vermelho'),
('lentilha'),
('grão-de-bico'),
('ervilha'),
('milho'),
('trigo'),
('aveia'),
('farinha de trigo'),
('farinha integral'),
('farinha de mandioca'),
('farinha de milho'),
('farinha de rosca'),
('farinha de aveia'),
('fubá'),
('amido de milho'),
('polvilho doce'),
('polvilho azedo'),
('tapioca'),
('quinoa'),
('chia'),
('linhaça'),
('gergelim'),
('macarrão'),
('espaguete'),
('penne'),
('parafuso'),
('talharim'),
('lasanha'),
('massa de pastel'),
('massa de pizza'),
('cuscuz'),

-- Carnes e aves
('frango'),
('peito de frango'),
('coxa de frango'),
('sobrecoxa de frango'),
('asa de frango'),
('carne bovina'),
('carne moída'),
('patinho'),
('alcatra'),
('contrafilé'),
('picanha'),
('acém'),
('coxão mole'),
('coxão duro'),
('maminha'),
('lagarto'),
('costela bovina'),
('filé mignon'),
('carne seca'),
('charque'),
('carne suína'),
('lombo suíno'),
('pernil suíno'),
('costelinha suína'),
('bacon'),
('linguiça'),
('linguiça calabresa'),
('linguiça toscana'),
('presunto'),
('presunto parma'),
('peito de peru'),

-- Peixes e frutos do mar
('peixe'),
('salmão'),
('atum'),
('sardinha'),
('tilápia'),
('merluza'),
('bacalhau'),
('pescada'),
('anchova'),
('camarão'),
('lula'),
('polvo'),
('mexilhão'),
('caranguejo'),

-- Ovos e laticínios
('ovo'),
('leite'),
('leite integral'),
('leite desnatado'),
('leite em pó'),
('leite de coco'),
('leite condensado'),
('creme de leite'),
('nata'),
('manteiga'),
('margarina'),
('queijo'),
('muçarela'),
('parmesão'),
('provolone'),
('queijo prato'),
('queijo minas'),
('gorgonzola'),
('ricota'),
('requeijão'),
('cream cheese'),
('cottage'),
('iogurte'),
('iogurte natural'),
('coalhada'),

-- Verduras e legumes
('tomate'),
('tomate-cereja'),
('cebola'),
('cebola roxa'),
('cebola branca'),
('alho'),
('cenoura'),
('batata'),
('batata-doce'),
('batata-baroa'),
('mandioca'),
('mandioquinha'),
('inhame'),
('abóbora'),
('abobrinha'),
('berinjela'),
('chuchu'),
('pimentão'),
('pimentão vermelho'),
('pimentão amarelo'),
('pimentão verde'),
('pepino'),
('brócolis'),
('couve-flor'),
('espinafre'),
('couve'),
('couve-manteiga'),
('alface'),
('rúcula'),
('agrião'),
('repolho'),
('repolho roxo'),
('acelga'),
('vagem'),
('quiabo'),
('jiló'),
('beterraba'),
('palmito'),
('azeitona'),
('alho-poró'),
('salsão'),
('nabo'),
('rabanete'),
('milho verde'),
('cogumelo'),
('champignon'),
('shimeji'),
('shiitake'),

-- Frutas
('banana'),
('banana-prata'),
('banana-nanica'),
('maçã'),
('laranja'),
('limão'),
('limão-siciliano'),
('morango'),
('uva'),
('abacaxi'),
('manga'),
('mamão'),
('melancia'),
('melão'),
('pera'),
('pêssego'),
('kiwi'),
('maracujá'),
('abacate'),
('coco'),
('goiaba'),
('acerola'),
('caju'),
('figo'),
('ameixa'),
('tangerina'),
('mexerica'),
('caqui'),
('pitaya'),
('framboesa'),
('amora'),
('mirtilo'),
('carambola'),
('jabuticaba'),
('graviola'),
('cupuaçu'),
('açaí'),

-- Castanhas e sementes
('amendoim'),
('castanha-de-caju'),
('castanha-do-pará'),
('nozes'),
('amêndoas'),
('avelã'),
('pistache'),
('macadâmia'),
('uva-passa'),
('damasco seco'),
('tâmara'),

-- Temperos e ervas
('sal'),
('sal grosso'),
('açúcar'),
('açúcar mascavo'),
('pimenta-do-reino'),
('pimenta branca'),
('pimenta dedo-de-moça'),
('pimenta calabresa'),
('pimenta biquinho'),
('páprica'),
('páprica doce'),
('páprica defumada'),
('orégano'),
('manjericão'),
('salsinha'),
('cebolinha'),
('coentro'),
('alecrim'),
('tomilho'),
('louro'),
('cominho'),
('cúrcuma'),
('açafrão'),
('canela'),
('canela em pó'),
('noz-moscada'),
('cravo-da-índia'),
('gengibre'),
('hortelã'),
('erva-doce'),
('colorau'),
('chimichurri'),
('baunilha'),

-- Molhos, óleos e condimentos
('azeite'),
('óleo'),
('óleo de coco'),
('óleo de gergelim'),
('vinagre'),
('vinagre de maçã'),
('vinagre balsâmico'),
('molho de tomate'),
('extrato de tomate'),
('molho de soja'),
('molho inglês'),
('mostarda'),
('mostarda dijon'),
('ketchup'),
('maionese'),
('molho de pimenta'),
('molho barbecue'),
('mel'),
('shoyu'),

-- Ingredientes para doces e sobremesas
('chocolate'),
('chocolate ao leite'),
('chocolate branco'),
('chocolate amargo'),
('chocolate em pó'),
('cacau em pó'),
('fermento químico'),
('fermento biológico'),
('bicarbonato de sódio'),
('essência de baunilha'),
('gelatina'),
('gelatina sem sabor'),
('doce de leite'),
('creme de avelã'),
('coco ralado'),
('granulado'),
('açúcar de confeiteiro'),
('açúcar demerara'),
('melado de cana'),
('rapadura'),

-- Pães, biscoitos e outros
('pão'),
('pão francês'),
('pão de forma'),
('pão integral'),
('pão de hambúrguer'),
('pão de hot dog'),
('biscoito'),
('biscoito maisena'),
('biscoito de chocolate'),
('bolacha'),
('torrada'),
('cereal'),
('granola'),
('fermento de pão'),
('água'),
('água de coco'),
('caldo de galinha'),
('caldo de carne'),
('caldo de legumes');

insert into tbl_porcao (numero_porcao) values
('1'),
('2'),
('3'),
('4'),
('5'),
('6'),
('7'),
('8'),
('9'),
('10'),
('11'),
('12'),
('13'),
('14'),
('+15');

insert into tbl_dificuldade (dificuldade) values
('Fácil'),
('Médio'),
('Difícil');

insert into tbl_custo (tipo_custo) values
('Econômico'),
('Moderado'),
('Alto');

insert into tbl_unidade_medida (unidade) values
('g'),
('kg'),
('ml'),
('L'),
('un');

insert into tbl_categoria (categoria) values
('Café da manhã'),
('Almoço'),
('Jantar'),
('Sobremesa'),
('Lanche'),
('Sopa'),
('Salada'),
('Bebida');

INSERT INTO tbl_tag (nome_tag) VALUES
('ComidaBoa'),
('ReceitaCaseira'),
('ReceitaRapida'), 
('FacilDeFazer'),
('Almoco'),
('Jantar'),
('CafeDaManha'),
('Lanche'),
('Sobremesa'),
('Doce'),
('Salgado'),
('Massa'),
('Carne'),
('Frango'),
('Peixe'),
('Vegetariana'),
('Vegana'),
('Saudavel'),
('Fit'),
('LowCarb'),
('Proteica'),
('BaixoCusto'),
('Economica'),
('Familia'),
('Romantico'),
('Festa'),
('Churrasco'),
('Natal'),
('AnoNovo'),
('ComidaBrasileira'),
('ComidaItaliana'),
('ComidaMexicana'),
('ComidaJaponesa'),
('ParaCriancas'),
('MealPrep'),
('AirFryer'),
('Microondas'),
('SemForno'),
('SemLactose'),
('SemGluten');

insert into tbl_status (status) values
('comprado'),
('pendente');

insert into tbl_categoria_principal (categoria_principal) values
('Confeitaria & Doces'),
('Culinária Brasileira'),
('Vegano & Vegetariano'),
('Fitness & Saudável'),
('Massas & Risotos'),
('Bebidas & Drinks'),
('Churrasco');