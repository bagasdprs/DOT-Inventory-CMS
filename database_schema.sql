-- 1. Table Users
CREATE TABLE public.category (
  id integer NOT NULL DEFAULT nextval('category_id_seq'::regclass),
  name character varying NOT NULL,
  description text,
  icon character varying NOT NULL DEFAULT 'fas fa-tags'::character varying,
  CONSTRAINT category_pkey PRIMARY KEY (id)
);

-- 2. Table Categories
CREATE TABLE public.product (
  id integer NOT NULL DEFAULT nextval('product_id_seq'::regclass),
  name character varying NOT NULL,
  price integer NOT NULL,
  description text,
  stock integer NOT NULL DEFAULT 0,
  category_id integer,
  CONSTRAINT product_pkey PRIMARY KEY (id),
  CONSTRAINT FK_0dce9bc93c2d2c399982d04bef1 FOREIGN KEY (category_id) REFERENCES public.category(id)
);

-- 3. Table Products
CREATE TABLE public.user (
  id integer NOT NULL DEFAULT nextval('user_id_seq'::regclass),
  password character varying NOT NULL,
  role character varying NOT NULL DEFAULT 'staff'::character varying,
  name character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  createdAt timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_pkey PRIMARY KEY (id)
);