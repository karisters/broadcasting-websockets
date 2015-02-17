DROP TABLE IF EXISTS "users";
CREATE TABLE "users" (	"id" int4 NOT NULL,"key" VARCHAR(17) NOT NULL) WITH (OIDS=FALSE);
ALTER TABLE "users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE IF EXISTS "users_id_seq";
CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE users_id_seq OWNED BY users.id;
ALTER TABLE "public"."users" ALTER COLUMN "id" SET DEFAULT nextval('users_id_seq'::regclass);
------------------------------------------------------------------------------------------------------------------------
DROP TABLE IF EXISTS "messages";
CREATE TABLE "messages" (
  "id" int4 NOT NULL,
  "text" TEXT NOT NULL
) WITH (OIDS=FALSE);
ALTER TABLE "messages" ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");
DROP SEQUENCE IF EXISTS "messages_id_seq";
CREATE SEQUENCE messages_id_seq
START WITH 1
INCREMENT BY 1
NO MINVALUE
NO MAXVALUE
CACHE 1;
ALTER SEQUENCE messages_id_seq OWNED BY messages.id;
ALTER TABLE "public"."messages" ALTER COLUMN "id" SET DEFAULT nextval('messages_id_seq'::regclass);
------------------------------------------------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS notify_messages() CASCADE;
CREATE FUNCTION notify_messages()
  RETURNS TRIGGER AS $$
DECLARE
BEGIN
    PERFORM pg_notify('new_message', new.text);
  RETURN new;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS notify_messages_trigger ON messages;
CREATE TRIGGER notify_messages_trigger AFTER UPDATE OR INSERT ON messages
FOR EACH ROW EXECUTE PROCEDURE notify_messages();