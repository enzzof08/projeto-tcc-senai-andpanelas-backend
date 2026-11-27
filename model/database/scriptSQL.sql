create database db_entre_panelas_2026;

USE db_entre_panelas_2026;
#drop database db_entre_panelas_2026;

#SHOW TABLES;

#SELECT * FROM tbl_status;

create table tbl_usuario (
	id			    int not null auto_increment primary key,
    nome    	    varchar(150) not null,
    username        varchar(20) not null,
    email		    varchar(256) not null,
    senha		    varchar(255) not null,
    data_nascimento date not null,
    descricao	    varchar(200),
    banner_url      varchar(2000),
    foto_perfil     varchar(2000),
    email_verificado boolean not null default false,

    CONSTRAINT UK_USUARIO_EMAIL UNIQUE (email),
    CONSTRAINT UK_USUARIO_USERNAME UNIQUE (username)
);

create table tbl_codigo_verificacao (
    id                  int not null auto_increment primary key,
    id_usuario          int not null,
    finalidade          enum('verificar_email', 'recuperar_senha') not null,
    codigo_hash         varchar(255) not null,
    data_expiracao      datetime not null,
    tentativas          int not null default 0,
    criado_em           datetime default current_timestamp,

    CONSTRAINT UK_CODIGO_USUARIO_FINALIDADE UNIQUE (id_usuario, finalidade),

    FOREIGN KEY (id_usuario) REFERENCES tbl_usuario(id)
    ON DELETE CASCADE
);

ALTER TABLE tbl_codigo_verificacao
MODIFY finalidade ENUM(
    'verificar_email',
    'recuperar_senha',
    'alterar_email'
) NOT NULL;

ALTER TABLE tbl_codigo_verificacao
ADD COLUMN novo_email VARCHAR(256) NULL;

create table tbl_em_alta (
	id			int not null auto_increment primary key,
    pesquisa	varchar(80) not null,
    data_dia 	date default (current_date)
);

create table tbl_unidade_medida (
	id			int not null auto_increment primary key,
	unidade		varchar(6) not null
);

create table tbl_geladeira_ingrediente (
	id			      int not null auto_increment primary key,
	nome_ingrediente  varchar(35) not null,
    id_usuario		  int not null,
    
    unique (id_usuario, nome_ingrediente),
    
    constraint FK_USUARIO_INGREDIENTE_GELADEIRA
    foreign key (id_usuario)
    references tbl_usuario(id)
);

create table tbl_seguindo_seguidor (
	id			int not null auto_increment primary key,
	id_seguindo int not null,
    id_seguidor int not null,
    
    UNIQUE (id_seguindo, id_seguidor),
    
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
    ON DELETE CASCADE
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
    references tbl_categoria(id)
    ON DELETE CASCADE,
    
	constraint FK_RECEITA_RECEITA_CATEGORIA
    foreign key (id_receita)
    references tbl_receita(id)
    ON DELETE CASCADE,
    
    UNIQUE (id_receita, id_categoria)
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
    references tbl_receita(id)
    ON DELETE CASCADE,
    
	constraint FK_TAG_TAG_RECEITA
    foreign key (id_tag)
    references tbl_tag(id)
    ON DELETE CASCADE,
    
    UNIQUE (id_receita, id_tag)
);

create table tbl_salvo (
	id			int not null auto_increment primary key,
	data_dia 	date default (current_date),
    id_receita  int not null,
    id_usuario  int not null,
    
    unique (id_usuario, id_receita),
    
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
    references tbl_receita(id)
    ON DELETE CASCADE,
    
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
    references tbl_status(id),
    
    UNIQUE (id_usuario, id_ingrediente)
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

CREATE TABLE tbl_denuncia (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    motivo VARCHAR(50) NOT NULL,
    detalhe VARCHAR(200),
    id_usuario INT NOT NULL,

    CONSTRAINT FK_USUARIO_DENUNCIA
    FOREIGN KEY (id_usuario)
    REFERENCES tbl_usuario(id)
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
    
    UNIQUE (id_comunidade, id_receita),
    
    constraint FK_RECEITA_COMUNIDADE_RECEITA
    foreign key (id_receita)
    references tbl_receita(id)
	ON DELETE CASCADE,
    
	constraint FK_COMUNIDADE_COMUNIDADE_RECEITA
    foreign key (id_comunidade)
    references tbl_comunidade(id)
	ON DELETE CASCADE
);

create table tbl_comunidade_usuario (
	id			  int not null auto_increment primary key,
	id_comunidade int not null,
    id_usuario    int not null,
    eh_criador      BOOLEAN NOT NULL DEFAULT FALSE,
    
    UNIQUE (id_comunidade, id_usuario),
    
    constraint FK_COMUNIDADE_COMUNIDADE_USUARIO
    foreign key (id_comunidade)
    references tbl_comunidade(id)
	ON DELETE CASCADE,
    
	constraint FK_USUARIO_COMUNIDADE_USUARIO
    foreign key (id_usuario)
    references tbl_usuario(id)
	ON DELETE CASCADE
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
	ingrediente			  varchar(35) not null
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
('Média'),
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

INSERT INTO tbl_categoria (categoria) VALUES
('Café da manhã'),
('Almoço'),
('Jantar'),
('Sobremesa'),
('Lanche'),
('Sopa'),
('Salada'),
('Bebida');

INSERT INTO tbl_tag (nome_tag) VALUES
('ReceitaCaseira'),
('ReceitaRapida'),
('FacilDeFazer'),
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

INSERT INTO tbl_categoria_principal (categoria_principal) VALUES
('Comida caseira'),
('Confeitaria e doces'),
('Massas, pizzas e risotos'),
('Carnes e aves'),
('Peixes e frutos do mar'),
('Churrasco'),
('Culinária brasileira'),
('Culinária internacional'),
('Alimentação saudável'),
('Culinária vegetariana e vegana'),
('Lanches e petiscos'),
('Pães e panificação'),
('Sopas e caldos'),
('Bebidas e drinks'),
('Receitas econômicas'),
('Receitas rápidas');

insert into tbl_status (status) values
('comprado'),
('pendente');

insert into tbl_usuario (
    id, 
    nome, 
    username, 
    email, 
    senha, 
    data_nascimento, 
    descricao, 
    banner_url, 
    foto_perfil
) values (
    1,
    'Chefinho IA',
    'chefinho',
    'chefinho@entrepanelas.com',
    '$2b$10$e8T8e7wQx9z.mockHashForChefinhoDoNotLoginDirectly', 
    '2026-01-01',
    'Seu assistente culinário inteligente do Entre Panelas! 🍳🤖',
    'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-oTt0q3TUctmgFN69Aq8HUbMCvL1t_7hPJSQu6F5XQPvx4NAq6M72tZs&s=10'
);

INSERT INTO tbl_usuario (
id, nome, username, email, senha, data_nascimento,
descricao, banner_url, foto_perfil, email_verificado
) VALUES
(
4,
'Camila Mendes',
'camila_doceira',
'camila.mendes@entrepanelas.com',
'$2b$10$iWRmgZ7SAi3cUGEv2Y806OztrkFpvNeEZM9lI0F6OrCOHu3.Gj1Sy',
'1999-03-18',
'Confeiteira nas horas vagas e apaixonada por cafés da manhã especiais.',
'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1600',
'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
TRUE
),
(
5,
'Rafael Costa',
'rafael_churras',
'rafael.costa@entrepanelas.com',
'$2b$10$iWRmgZ7SAi3cUGEv2Y806OztrkFpvNeEZM9lI0F6OrCOHu3.Gj1Sy',
'1997-11-05',
'Fã de carnes na brasa, hambúrguer artesanal e almoços em família.',
'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600',
'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
TRUE
),
(
6,
'Juliana Rocha',
'juliana_fit',
'juliana.rocha@entrepanelas.com',
'$2b$10$iWRmgZ7SAi3cUGEv2Y806OztrkFpvNeEZM9lI0F6OrCOHu3.Gj1Sy',
'2002-07-29',
'Receitas leves, saladas criativas e praticidade para a rotina.',
'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1600',
'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
TRUE
),
(
7,
'Thiago Almeida',
'thiago_massas',
'thiago.almeida@entrepanelas.com',
'$2b$10$iWRmgZ7SAi3cUGEv2Y806OztrkFpvNeEZM9lI0F6OrCOHu3.Gj1Sy',
'1998-01-12',
'Explorando massas, risotos e jantares descomplicados.',
'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1600',
'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
TRUE
),
(
8,
'Beatriz Lima',
'beatriz_veggie',
'beatriz.lima@entrepanelas.com',
'$2b$10$iWRmgZ7SAi3cUGEv2Y806OztrkFpvNeEZM9lI0F6OrCOHu3.Gj1Sy',
'2001-08-10',
'Culinária vegetariana, caldos quentinhos e comida com afeto.',
'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1600',
'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
TRUE
);

INSERT INTO tbl_comunidade (foto_url, nome, banner_url, descricao, id_categoria_principal)
VALUES (
'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
'Confeitaria Descomplicada',
'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=1600',
'Sobremesas práticas, chocolates e doces para qualquer ocasião.',
2
);
SET @com_camila_1 = LAST_INSERT_ID();

INSERT INTO tbl_comunidade (foto_url, nome, banner_url, descricao, id_categoria_principal)
VALUES (
'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800',
'Mesa de Café da Manhã',
'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600',
'Ideias de pães, panquecas e acompanhamentos para começar bem o dia.',
12
);
SET @com_camila_2 = LAST_INSERT_ID();

INSERT INTO tbl_comunidade (foto_url, nome, banner_url, descricao, id_categoria_principal)
VALUES (
'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800',
'Mestres da Brasa',
'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600',
'Cortes, pontos da carne, acompanhamentos e dicas de churrasco.',
6
);
SET @com_rafael_1 = LAST_INSERT_ID();

INSERT INTO tbl_comunidade (foto_url, nome, banner_url, descricao, id_categoria_principal)
VALUES (
'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
'Carnes e Lanches Artesanais',
'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600',
'Hambúrgueres, assados e receitas caprichadas com carnes.',
4
);
SET @com_rafael_2 = LAST_INSERT_ID();

INSERT INTO tbl_comunidade (foto_url, nome, banner_url, descricao, id_categoria_principal)
VALUES (
'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
'Rotina Leve e Saudável',
'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1600',
'Pratos equilibrados, bebidas naturais e lanches nutritivos.',
9
);
SET @com_juliana_1 = LAST_INSERT_ID();

INSERT INTO tbl_comunidade (foto_url, nome, banner_url, descricao, id_categoria_principal)
VALUES (
'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
'Saladas Criativas',
'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1600',
'Combinações de folhas, molhos caseiros e proteínas para refeições completas.',
9
);
SET @com_juliana_2 = LAST_INSERT_ID();

INSERT INTO tbl_comunidade (foto_url, nome, banner_url, descricao, id_categoria_principal)
VALUES (
'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800',
'Amantes de Massas e Risotos',
'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1600',
'Molhos clássicos, massas frescas e risotos cremosos.',
3
);
SET @com_thiago_1 = LAST_INSERT_ID();

INSERT INTO tbl_comunidade (foto_url, nome, banner_url, descricao, id_categoria_principal)
VALUES (
'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
'Jantar Rápido da Semana',
'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1600',
'Receitas práticas para preparar em menos de 40 minutos à noite.',
16
);
SET @com_thiago_2 = LAST_INSERT_ID();

INSERT INTO tbl_comunidade (foto_url, nome, banner_url, descricao, id_categoria_principal)
VALUES (
'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
'Caldos e Sopas Aconchegantes',
'https://images.unsplash.com/photo-1547592180-85f173990554?w=1600',
'Cremes, caldos e sopas nutritivas para dias frios ou jantares leves.',
13
);
SET @com_beatriz_1 = LAST_INSERT_ID();

INSERT INTO tbl_comunidade (foto_url, nome, banner_url, descricao, id_categoria_principal)
VALUES (
'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
'Cozinha Veggie do Dia a Dia',
'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1600',
'Pratos vegetarianos saborosos, criativos e acessíveis.',
10
);
SET @com_beatriz_2 = LAST_INSERT_ID();

INSERT INTO tbl_comunidade_usuario (id_comunidade, id_usuario, eh_criador) VALUES
(@com_camila_1, 4, TRUE),
(@com_camila_2, 4, TRUE),
(@com_rafael_1, 5, TRUE),
(@com_rafael_2, 5, TRUE),
(@com_juliana_1, 6, TRUE),
(@com_juliana_2, 6, TRUE),
(@com_thiago_1, 7, TRUE),
(@com_thiago_2, 7, TRUE),
(@com_beatriz_1, 8, TRUE),
(@com_beatriz_2, 8, TRUE);

INSERT INTO tbl_receita (titulo, descricao, tempo, foto, video, id_custo, id_dificuldade, id_porcao, id_usuario)
VALUES ('Panqueca americana fofinha', 'Massa leve e dourada para servir com mel ou frutas no café da manhã.', '00:25:00', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200', NULL, 1, 1, 4, 4);
SET @rec_camila_1 = LAST_INSERT_ID();

INSERT INTO tbl_ingrediente (nome, quantidade, id_receita, id_unidade_medida) VALUES
('Farinha de trigo', '200', @rec_camila_1, 1),
('Leite', '240', @rec_camila_1, 3),
('Ovo', '1', @rec_camila_1, 5),
('Açúcar', '30', @rec_camila_1, 1),
('Fermento químico', '10', @rec_camila_1, 1);

INSERT INTO tbl_modo_preparo (metodo_preparo, ordem_preparo, id_receita) VALUES
('Misture os ingredientes secos em uma tigela.', 1, @rec_camila_1),
('Acrescente o ovo e o leite, mexendo até obter uma massa homogênea.', 2, @rec_camila_1),
('Doure pequenas conchas da massa em frigideira untada dos dois lados.', 3, @rec_camila_1);

INSERT INTO tbl_receita_categoria (id_categoria, id_receita) VALUES (1, @rec_camila_1);
INSERT INTO tbl_tag_receita (id_receita, id_tag) VALUES (@rec_camila_1, 2), (@rec_camila_1, 4);
INSERT INTO tbl_comunidade_receita (id_comunidade, id_receita) VALUES (@com_camila_2, @rec_camila_1);

INSERT INTO tbl_receita (titulo, descricao, tempo, foto, video, id_custo, id_dificuldade, id_porcao, id_usuario)
VALUES ('Mousse de chocolate meio amargo', 'Sobremesa aerada e intensa feita com apenas três ingredientes.', '00:20:00', 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=1200', NULL, 2, 1, 6, 4);
SET @rec_camila_2 = LAST_INSERT_ID();

INSERT INTO tbl_ingrediente (nome, quantidade, id_receita, id_unidade_medida) VALUES
('Chocolate amargo', '200', @rec_camila_2, 1),
('Creme de leite', '200', @rec_camila_2, 1),
('Ovo', '3', @rec_camila_2, 5);

INSERT INTO tbl_modo_preparo (metodo_preparo, ordem_preparo, id_receita) VALUES
('Derreta o chocolate em banho-maria e misture com o creme de leite.', 1, @rec_camila_2),
('Bata as claras em neve firme e incorpore delicadamente ao creme.', 2, @rec_camila_2),
('Leve à geladeira por pelo menos 3 horas antes de servir.', 3, @rec_camila_2);

INSERT INTO tbl_receita_categoria (id_categoria, id_receita) VALUES (4, @rec_camila_2);
INSERT INTO tbl_tag_receita (id_receita, id_tag) VALUES (@rec_camila_2, 4), (@rec_camila_2, 31);
INSERT INTO tbl_comunidade_receita (id_comunidade, id_receita) VALUES (@com_camila_1, @rec_camila_2);

INSERT INTO tbl_receita (titulo, descricao, tempo, foto, video, id_custo, id_dificuldade, id_porcao, id_usuario)
VALUES ('Chocolate quente cremoso', 'Bebida encorpada com toque de canela para dias mais frescos.', '00:15:00', 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=1200', NULL, 1, 1, 2, 4);
SET @rec_camila_3 = LAST_INSERT_ID();

INSERT INTO tbl_ingrediente (nome, quantidade, id_receita, id_unidade_medida) VALUES
('Leite integral', '400', @rec_camila_3, 3),
('Chocolate em pó', '40', @rec_camila_3, 1),
('Amido de milho', '10', @rec_camila_3, 1),
('Canela em pó', '2', @rec_camila_3, 1);

INSERT INTO tbl_modo_preparo (metodo_preparo, ordem_preparo, id_receita) VALUES
('Dissolva o amido e o chocolate em pó no leite frio.', 1, @rec_camila_3),
('Leve ao fogo médio mexendo sempre até engrossar.', 2, @rec_camila_3),
('Finalize com canela em pó por cima e sirva quente.', 3, @rec_camila_3);

INSERT INTO tbl_receita_categoria (id_categoria, id_receita) VALUES (8, @rec_camila_3);
INSERT INTO tbl_tag_receita (id_receita, id_tag) VALUES (@rec_camila_3, 2), (@rec_camila_3, 4);

INSERT INTO tbl_receita (titulo, descricao, tempo, foto, video, id_custo, id_dificuldade, id_porcao, id_usuario)
VALUES ('Fraldinha na manteiga de alho', 'Corte suculento selado e finalizado com manteiga temperada.', '00:45:00', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200', NULL, 3, 2, 4, 5);
SET @rec_rafael_1 = LAST_INSERT_ID();

INSERT INTO tbl_ingrediente (nome, quantidade, id_receita, id_unidade_medida) VALUES
('Carne bovina', '1', @rec_rafael_1, 2),
('Manteiga', '50', @rec_rafael_1, 1),
('Alho', '4', @rec_rafael_1, 5),
('Sal grosso', '20', @rec_rafael_1, 1),
('Salsinha', '10', @rec_rafael_1, 1);

INSERT INTO tbl_modo_preparo (metodo_preparo, ordem_preparo, id_receita) VALUES
('Tempere a fraldinha com sal grosso e leve à grelha ou frigideira bem quente.', 1, @rec_rafael_1),
('Misture a manteiga amolecida com o alho picado e a salsinha.', 2, @rec_rafael_1),
('Retire a carne no ponto desejado, espalhe a manteiga por cima e fatie.', 3, @rec_rafael_1);

INSERT INTO tbl_receita_categoria (id_categoria, id_receita) VALUES (2, @rec_rafael_1);
INSERT INTO tbl_tag_receita (id_receita, id_tag) VALUES (@rec_rafael_1, 7), (@rec_rafael_1, 20);
INSERT INTO tbl_comunidade_receita (id_comunidade, id_receita) VALUES (@com_rafael_1, @rec_rafael_1);

INSERT INTO tbl_receita (titulo, descricao, tempo, foto, video, id_custo, id_dificuldade, id_porcao, id_usuario)
VALUES ('Hambúrguer artesanal suculento', 'Blend caseiro selado na chapa com queijo derretido no pão brioche.', '00:30:00', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200', NULL, 2, 1, 2, 5);
SET @rec_rafael_2 = LAST_INSERT_ID();

INSERT INTO tbl_ingrediente (nome, quantidade, id_receita, id_unidade_medida) VALUES
('Acém', '360', @rec_rafael_2, 1),
('Pão de hambúrguer', '2', @rec_rafael_2, 5),
('Queijo prato', '60', @rec_rafael_2, 1),
('Sal', '5', @rec_rafael_2, 1),
('Pimenta-do-reino', '2', @rec_rafael_2, 1);

INSERT INTO tbl_modo_preparo (metodo_preparo, ordem_preparo, id_receita) VALUES
('Modele dois discos de 180g sem apertar demais a carne.', 1, @rec_rafael_2),
('Tempere com sal e pimenta na hora de levar à chapa bem quente.', 2, @rec_rafael_2),
('Vire, coloque o queijo para derreter e monte no pão selado na manteiga.', 3, @rec_rafael_2);

INSERT INTO tbl_receita_categoria (id_categoria, id_receita) VALUES (5, @rec_rafael_2);
INSERT INTO tbl_tag_receita (id_receita, id_tag) VALUES (@rec_rafael_2, 5), (@rec_rafael_2, 7);
INSERT INTO tbl_comunidade_receita (id_comunidade, id_receita) VALUES (@com_rafael_2, @rec_rafael_2);

INSERT INTO tbl_receita (titulo, descricao, tempo, foto, video, id_custo, id_dificuldade, id_porcao, id_usuario)
VALUES ('Escondidinho de carne seca', 'Purê cremoso de mandioca gratinado com recheio bem temperado.', '01:00:00', 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=1200', NULL, 2, 2, 6, 5);
SET @rec_rafael_3 = LAST_INSERT_ID();

INSERT INTO tbl_ingrediente (nome, quantidade, id_receita, id_unidade_medida) VALUES
('Carne seca', '500', @rec_rafael_3, 1),
('Mandioca', '800', @rec_rafael_3, 1),
('Requeijão', '200', @rec_rafael_3, 1),
('Cebola', '1', @rec_rafael_3, 5),
('Parmesão', '50', @rec_rafael_3, 1);

INSERT INTO tbl_modo_preparo (metodo_preparo, ordem_preparo, id_receita) VALUES
('Cozinhe e desfie a carne seca já dessalgada, refogando com cebola.', 1, @rec_rafael_3),
('Cozinhe a mandioca e amasse com requeijão até formar um purê liso.', 2, @rec_rafael_3),
('Monte camadas em um refratário, cubra com parmesão e leve para gratinar.', 3, @rec_rafael_3);

INSERT INTO tbl_receita_categoria (id_categoria, id_receita) VALUES (3, @rec_rafael_3);
INSERT INTO tbl_tag_receita (id_receita, id_tag) VALUES (@rec_rafael_3, 1), (@rec_rafael_3, 23);

INSERT INTO tbl_receita (titulo, descricao, tempo, foto, video, id_custo, id_dificuldade, id_porcao, id_usuario)
VALUES ('Salada Caesar com frango grelhado', 'Folhas crocantes, tiras de frango douradas e molho cremoso.', '00:25:00', 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=1200', NULL, 2, 1, 2, 6);
SET @rec_juliana_1 = LAST_INSERT_ID();

INSERT INTO tbl_ingrediente (nome, quantidade, id_receita, id_unidade_medida) VALUES
('Alface', '1', @rec_juliana_1, 5),
('Peito de frango', '250', @rec_juliana_1, 1),
('Iogurte natural', '100', @rec_juliana_1, 1),
('Parmesão', '30', @rec_juliana_1, 1),
('Limão', '1', @rec_juliana_1, 5);

INSERT INTO tbl_modo_preparo (metodo_preparo, ordem_preparo, id_receita) VALUES
('Grelhe o peito de frango temperado e corte em tiras.', 1, @rec_juliana_1),
('Misture o iogurte, suco de limão e metade do parmesão para o molho.', 2, @rec_juliana_1),
('Disponha a alface rasgada, o frango, o molho e finalize com parmesão.', 3, @rec_juliana_1);

INSERT INTO tbl_receita_categoria (id_categoria, id_receita) VALUES (7, @rec_juliana_1);
INSERT INTO tbl_tag_receita (id_receita, id_tag) VALUES (@rec_juliana_1, 12), (@rec_juliana_1, 15);
INSERT INTO tbl_comunidade_receita (id_comunidade, id_receita) VALUES (@com_juliana_2, @rec_juliana_1);

INSERT INTO tbl_receita (titulo, descricao, tempo, foto, video, id_custo, id_dificuldade, id_porcao, id_usuario)
VALUES ('Suco verde detox refrescante', 'Combinação leve de couve, abacaxi, limão e hortelã.', '00:10:00', 'https://images.unsplash.com/photo-1610970881699-44a587cabec?w=1200', NULL, 1, 1, 2, 6);
SET @rec_juliana_2 = LAST_INSERT_ID();

INSERT INTO tbl_ingrediente (nome, quantidade, id_receita, id_unidade_medida) VALUES
('Couve-manteiga', '2', @rec_juliana_2, 5),
('Abacaxi', '150', @rec_juliana_2, 1),
('Água de coco', '300', @rec_juliana_2, 3),
('Hortelã', '5', @rec_juliana_2, 1);

INSERT INTO tbl_modo_preparo (metodo_preparo, ordem_preparo, id_receita) VALUES
('Higienize bem as folhas de couve e a hortelã.', 1, @rec_juliana_2),
('Bata todos os ingredientes no liquidificador até ficar bem liso.', 2, @rec_juliana_2),
('Sirva imediatamente com pedras de gelo.', 3, @rec_juliana_2);

INSERT INTO tbl_receita_categoria (id_categoria, id_receita) VALUES (8, @rec_juliana_2);
INSERT INTO tbl_tag_receita (id_receita, id_tag) VALUES (@rec_juliana_2, 11), (@rec_juliana_2, 12);
INSERT INTO tbl_comunidade_receita (id_comunidade, id_receita) VALUES (@com_juliana_1, @rec_juliana_2);

INSERT INTO tbl_receita (titulo, descricao, tempo, foto, video, id_custo, id_dificuldade, id_porcao, id_usuario)
VALUES ('Crepioca proteica de queijo', 'Opção rápida e nutritiva para o café da manhã ou pós-treino.', '00:10:00', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=1200', NULL, 1, 1, 1, 6);
SET @rec_juliana_3 = LAST_INSERT_ID();

INSERT INTO tbl_ingrediente (nome, quantidade, id_receita, id_unidade_medida) VALUES
('Ovo', '1', @rec_juliana_3, 5),
('Tapioca', '30', @rec_juliana_3, 1),
('Queijo minas', '40', @rec_juliana_3, 1),
('Orégano', '2', @rec_juliana_3, 1);

INSERT INTO tbl_modo_preparo (metodo_preparo, ordem_preparo, id_receita) VALUES
('Bata o ovo com a goma de tapioca e uma pitada de sal.', 1, @rec_juliana_3),
('Despeje em frigideira antiaderente aquecida e doure os dois lados.', 2, @rec_juliana_3),
('Recheie com queijo minas e orégano, dobre e sirva.', 3, @rec_juliana_3);

INSERT INTO tbl_receita_categoria (id_categoria, id_receita) VALUES (1, @rec_juliana_3);
INSERT INTO tbl_tag_receita (id_receita, id_tag) VALUES (@rec_juliana_3, 13), (@rec_juliana_3, 15);

INSERT INTO tbl_receita (titulo, descricao, tempo, foto, video, id_custo, id_dificuldade, id_porcao, id_usuario)
VALUES ('Espaguete ao molho carbonara', 'Massa clássica italiana com emulsão cremosa de gemas, queijo e bacon.', '00:25:00', 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=1200', NULL, 2, 2, 2, 7);
SET @rec_thiago_1 = LAST_INSERT_ID();

INSERT INTO tbl_ingrediente (nome, quantidade, id_receita, id_unidade_medida) VALUES
('Espaguete', '250', @rec_thiago_1, 1),
('Bacon', '120', @rec_thiago_1, 1),
('Ovo', '2', @rec_thiago_1, 5),
('Parmesão', '60', @rec_thiago_1, 1),
('Pimenta-do-reino', '3', @rec_thiago_1, 1);

INSERT INTO tbl_modo_preparo (metodo_preparo, ordem_preparo, id_receita) VALUES
('Cozinhe o espaguete em água fervente com sal até ficar al dente.', 1, @rec_thiago_1),
('Doure o bacon picado em uma frigideira e reserve.', 2, @rec_thiago_1),
('Misture os ovos com parmesão e pimenta, junte a massa quente fora do fogo e emulsione com água do cozimento.', 3, @rec_thiago_1);

INSERT INTO tbl_receita_categoria (id_categoria, id_receita) VALUES (3, @rec_thiago_1);
INSERT INTO tbl_tag_receita (id_receita, id_tag) VALUES (@rec_thiago_1, 6), (@rec_thiago_1, 24);
INSERT INTO tbl_comunidade_receita (id_comunidade, id_receita) VALUES (@com_thiago_1, @rec_thiago_1);

INSERT INTO tbl_receita (titulo, descricao, tempo, foto, video, id_custo, id_dificuldade, id_porcao, id_usuario)
VALUES ('Risoto cremoso de cogumelos', 'Arroz arbóreo cozido lentamente com cogumelos frescos e parmesão.', '00:40:00', 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=1200', NULL, 3, 2, 4, 7);
SET @rec_thiago_2 = LAST_INSERT_ID();

INSERT INTO tbl_ingrediente (nome, quantidade, id_receita, id_unidade_medida) VALUES
('Arroz arbóreo', '300', @rec_thiago_2, 1),
('Cogumelo', '200', @rec_thiago_2, 1),
('Caldo de legumes', '1', @rec_thiago_2, 4),
('Manteiga', '40', @rec_thiago_2, 1),
('Parmesão', '80', @rec_thiago_2, 1);

INSERT INTO tbl_modo_preparo (metodo_preparo, ordem_preparo, id_receita) VALUES
('Salteie os cogumelos fatiados na manteiga e reserve.', 1, @rec_thiago_2),
('Refogue o arroz arbóreo e adicione o caldo quente aos poucos, mexendo sempre.', 2, @rec_thiago_2),
('Quando o grão estiver al dente, incorpore os cogumelos, manteiga gelada e parmesão.', 3, @rec_thiago_2);

INSERT INTO tbl_receita_categoria (id_categoria, id_receita) VALUES (2, @rec_thiago_2);
INSERT INTO tbl_tag_receita (id_receita, id_tag) VALUES (@rec_thiago_2, 10), (@rec_thiago_2, 24);

INSERT INTO tbl_receita (titulo, descricao, tempo, foto, video, id_custo, id_dificuldade, id_porcao, id_usuario)
VALUES ('Caldo verde cremoso de batata', 'Versão vegetariana aveludada com couve fatiada bem fininha.', '00:35:00', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1200', NULL, 1, 1, 4, 8);
SET @rec_beatriz_1 = LAST_INSERT_ID();

INSERT INTO tbl_ingrediente (nome, quantidade, id_receita, id_unidade_medida) VALUES
('Batata', '600', @rec_beatriz_1, 1),
('Couve-manteiga', '150', @rec_beatriz_1, 1),
('Cebola', '1', @rec_beatriz_1, 5),
('Alho', '2', @rec_beatriz_1, 5),
('Azeite', '20', @rec_beatriz_1, 3);

INSERT INTO tbl_modo_preparo (metodo_preparo, ordem_preparo, id_receita) VALUES
('Refogue a cebola e o alho no azeite e cozinhe as batatas em água com sal.', 1, @rec_beatriz_1),
('Bata as batatas cozidas com o caldo no liquidificador até ficar cremoso.', 2, @rec_beatriz_1),
('Volte à panela, junte a couve fatiada fina e cozinhe por 3 minutos.', 3, @rec_beatriz_1);

INSERT INTO tbl_receita_categoria (id_categoria, id_receita) VALUES (6, @rec_beatriz_1);
INSERT INTO tbl_tag_receita (id_receita, id_tag) VALUES (@rec_beatriz_1, 11), (@rec_beatriz_1, 16);
INSERT INTO tbl_comunidade_receita (id_comunidade, id_receita) VALUES (@com_beatriz_1, @rec_beatriz_1);

INSERT INTO tbl_receita (titulo, descricao, tempo, foto, video, id_custo, id_dificuldade, id_porcao, id_usuario)
VALUES ('Wrap integral de grão-de-bico', 'Lanche prático com pasta temperada de grão-de-bico e vegetais crocantes.', '00:20:00', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=1200', NULL, 1, 1, 2, 8);
SET @rec_beatriz_2 = LAST_INSERT_ID();

INSERT INTO tbl_ingrediente (nome, quantidade, id_receita, id_unidade_medida) VALUES
('Grão-de-bico', '200', @rec_beatriz_2, 1),
('Cenoura', '1', @rec_beatriz_2, 5),
('Rúcula', '50', @rec_beatriz_2, 1),
('Azeite', '15', @rec_beatriz_2, 3),
('Limão', '1', @rec_beatriz_2, 5);

INSERT INTO tbl_modo_preparo (metodo_preparo, ordem_preparo, id_receita) VALUES
('Amasse o grão-de-bico cozido com azeite, suco de limão e sal.', 1, @rec_beatriz_2),
('Espalhe a pasta sobre a massa de wrap e adicione cenoura ralada e rúcula.', 2, @rec_beatriz_2),
('Enrole firme, corte ao meio e sirva.', 3, @rec_beatriz_2);

INSERT INTO tbl_receita_categoria (id_categoria, id_receita) VALUES (5, @rec_beatriz_2);
INSERT INTO tbl_tag_receita (id_receita, id_tag) VALUES (@rec_beatriz_2, 10), (@rec_beatriz_2, 12);
INSERT INTO tbl_comunidade_receita (id_comunidade, id_receita) VALUES (@com_beatriz_2, @rec_beatriz_2);

INSERT INTO tbl_receita (titulo, descricao, tempo, foto, video, id_custo, id_dificuldade, id_porcao, id_usuario)
VALUES ('Bolo integral de banana com aveia', 'Bolo fofinho adoçado naturalmente com bananas maduras e canela.', '00:45:00', 'https://images.unsplash.com/photo-1605286978633-2dec93ff88a2?w=1200', NULL, 1, 1, 8, 8);
SET @rec_beatriz_3 = LAST_INSERT_ID();

INSERT INTO tbl_ingrediente (nome, quantidade, id_receita, id_unidade_medida) VALUES
('Banana-nanica', '4', @rec_beatriz_3, 5),
('Aveia', '200', @rec_beatriz_3, 1),
('Ovo', '3', @rec_beatriz_3, 5),
('Óleo de coco', '50', @rec_beatriz_3, 3),
('Fermento químico', '15', @rec_beatriz_3, 1);

INSERT INTO tbl_modo_preparo (metodo_preparo, ordem_preparo, id_receita) VALUES
('Bata no liquidificador as bananas, os ovos e o óleo de coco.', 1, @rec_beatriz_3),
('Transfira para uma tigela e misture a aveia e o fermento.', 2, @rec_beatriz_3),
('Asse em forma untada a 180°C por cerca de 35 minutos.', 3, @rec_beatriz_3);

INSERT INTO tbl_receita_categoria (id_categoria, id_receita) VALUES (4, @rec_beatriz_3);
INSERT INTO tbl_tag_receita (id_receita, id_tag) VALUES (@rec_beatriz_3, 4), (@rec_beatriz_3, 12);

INSERT INTO tbl_comentario (comentario, id_receita, id_usuario) VALUES
('Fiz esse hambúrguer no fim de semana e o ponto da carne ficou perfeito!', @rec_rafael_2, 4),
('Adorei que não vai açúcar refinado, ficou super fofinho com café.', @rec_beatriz_3, 4);

INSERT INTO tbl_comentario (comentario, id_receita, id_usuario) VALUES
('Receita rápida e com textura incrível, sucesso aqui em casa!', @rec_camila_2, 5),
('O segredo da água do cozimento fez toda a diferença no molho.', @rec_thiago_1, 5);

INSERT INTO tbl_comentario (comentario, id_receita, id_usuario) VALUES
('Leve, nutritivo e perfeito para os dias mais frios. Amei!', @rec_beatriz_1, 6),
('A manteiga de alho deixou a carne muito saborosa.', @rec_rafael_1, 6);

INSERT INTO tbl_comentario (comentario, id_receita, id_usuario) VALUES
('Esse molho de iogurte deixou a salada bem leve e refrescante.', @rec_juliana_1, 7),
('Massa muito prática e fofinha, já salvei para fazer no domingo.', @rec_camila_1, 7);

INSERT INTO tbl_comentario (comentario, id_receita, id_usuario) VALUES
('Ficou super cremoso! Usei cogumelos frescos e deu um sabor incrível.', @rec_thiago_2, 8),
('Combinação perfeita de abacaxi com hortelã, muito refrescante.', @rec_juliana_2, 8);