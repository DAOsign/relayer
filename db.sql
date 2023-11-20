create table network
(
    network_id serial
        constraint network_pk
            primary key,
    name       varchar not null
        constraint network_uniq_name
            unique
);

create table account
(
    account_id serial
        constraint account_pk
            primary key,
    network_id integer not null
        constraint account_network_network_id_fk
            references network,
    address    varchar not null,
    hd_path    varchar not null,
    locked     boolean not null
);

comment on column account.account_id is 'PK';

comment on column account.network_id is 'Network ID';

comment on column account.address is 'Blockchain Address derived from Master Key';

comment on column account.hd_path is 'BIP44 Hierarchical deterministic path';

comment on column account.locked is 'True if address is locked by executing transaction';

create table tx
(
    tx_id      serial
        constraint tx_pk
            primary key,
    payload    jsonb                                  not null,
    network_id integer                                not null
        constraint tx_network_network_id_fk
            references network,
    tx_hash    varchar,
    account_id integer
        constraint tx_account_account_id_fk
            references account,
    status     integer,
    error      varchar,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone               not null
);

comment on column tx.payload is 'Raw transaction payload (Proof in json format)';

comment on column tx.network_id is 'Network ID';

comment on column tx.tx_hash is 'Transaction hash';

comment on column tx.account_id is 'Account ID used to sign transaction';

comment on column tx.status is 'Transaction execution status. 1 - new, 2 - in progress, 3 - success, 4 - error';
