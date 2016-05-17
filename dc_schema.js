'use strict';

const _ = require('lodash');

const DAU_FIELD_LIST = [
  { name: "app", length: 16, type: "string", is_null: false, default: "" },
  { name: "app_ver", length: 16, type: "string", is_null: false, default: "" },
  { name: "server_ver", length: 16, type: "string", is_null: true, default: null },
  { name: "config_ver", length: 16, type: "string", is_null: true, default: null },

  { name: "ingest_datetime", length: 0, type: "datetime", is_null: true, default: null },
  { name: "event_datetime", length: 0, type: "datetime", is_null: false, default: "" },

  { name: "device_tag", length: 64, type: "string", is_null: false, default: "" },
  { name: "device_type", length: 32, type: "string", is_null: false, default: "" },
  { name: "device_family", length: 32, type: "string", is_null: true, default: null },

  { name: "user_map_tag", length: 64, type: "string", is_null: false, default: "" },

  { name: "os", length: 16, type: "string", is_null: false, default: "" },
  { name: "os_ver", length: 16, type: "string", is_null: false, default: "" },

  { name: "browser", length: 16, type: "string", is_null: true, default: null },
  { name: "browser_ver", length: 16, type: "string", is_null: true, default: null },

  { name: "marketplace", length: 16, type: "string", is_null: true, default: null },

  { name: "country", length: 2, type: "string", is_null: false, default: "ZZ" },
  { name: "language", length: 5, type: "string", is_null: false, default: "" },

  { name: "online_status", length: 16, type: "string", is_null: true, default: null },

  { name: "group_tag", length: 64, type: "string", is_null: true, default: null },

  { name: "kingdom", length: 32, type: "string", is_null: true, default: null },
  { name: "phylum", length: 32, type: "string", is_null: true, default: null },
  { name: "class", length: 32, type: "string", is_null: true, default: null },
  { name: "order", length: 32, type: "string", is_null: true, default: null },
  { name: "family", length: 32, type: "string", is_null: true, default: null },
  { name: "genus", length: 32, type: "string", is_null: true, default: null },
  { name: "species", length: 32, type: "string", is_null: true, default: null },

  { name: "float1", length: 0, type: "float", is_null: false, default: 0.0 },
  { name: "float2", length: 0, type: "float", is_null: false, default: 0.0 },
  { name: "float3", length: 0, type: "float", is_null: false, default: 0.0 },
  { name: "float4", length: 0, type: "float", is_null: false, default: 0.0 },

  { name: "event_index", length: 0, type: "int", is_null: true, default: null },
];

const INSTALL_FIELD_LIST = _.union(DAU_FIELD_LIST,
[
  { name: "is_attributed", length: 0, type: "boolean", is_null: false, default: 0 },
]);

const ECONOMY_FIELD_LIST = _.union(DAU_FIELD_LIST,
[
  { name: "spend_amount", length: 0, type: "float", is_null: false, default: 0.0 },
  { name: "spend_currency", length: 16, type: "string", is_null: false, default: "" },
  { name: "spend_type", length: 16, type: "string", is_null: true, default: null },
]);

const MSG_SEND_FIELD_LIST = [
  { name: "app", length: 16, type: "string", is_null: false, default: "" },
  { name: "app_ver", length: 16, type: "string", is_null: false, default: "" },
  { name: "server_ver", length: 16, type: "string", is_null: true, default: null },
  { name: "config_ver", length: 16, type: "string", is_null: true, default: null },

  { name: "ingest_datetime", length: 0, type: "datetime", is_null: true, default: null },
  { name: "event_datetime", length: 0, type: "datetime", is_null: false, default: "" },

  { name: "device_tag", length: 64, type: "string", is_null: false, default: "" },
  { name: "device_type", length: 32, type: "string", is_null: false, default: "" },
  { name: "device_family", length: 32, type: "string", is_null: true, default: null },

  { name: "user_map_tag", length: 64, type: "string", is_null: false, default: "" },

  { name: "os", length: 16, type: "string", is_null: false, default: "" },
  { name: "os_ver", length: 16, type: "string", is_null: false, default: "" },

  { name: "browser", length: 16, type: "string", is_null: true, default: null },
  { name: "browser_ver", length: 16, type: "string", is_null: true, default: null },

  { name: "marketplace", length: 16, type: "string", is_null: true, default: null },

  { name: "country", length: 2, type: "string", is_null: false, default: "ZZ" },
  { name: "language", length: 5, type: "string", is_null: false, default: "" },

  { name: "group_tag", length: 64, type: "string", is_null: true, default: null },

  { name: "kingdom", length: 32, type: "string", is_null: true, default: null },
  { name: "phylum", length: 32, type: "string", is_null: true, default: null },
  { name: "class", length: 32, type: "string", is_null: true, default: null },
  { name: "order", length: 32, type: "string", is_null: true, default: null },
  { name: "family", length: 32, type: "string", is_null: true, default: null },
  { name: "genus", length: 32, type: "string", is_null: true, default: null },
  { name: "species", length: 32, type: "string", is_null: true, default: null },

  { name: "float1", length: 0, type: "float", is_null: false, default: 0.0 },
  { name: "float2", length: 0, type: "float", is_null: false, default: 0.0 },
  { name: "float3", length: 0, type: "float", is_null: false, default: 0.0 },
  { name: "float4", length: 0, type: "float", is_null: false, default: 0.0 },

  { name: "network", length: 16, type: "string", is_null: false, default: "" },
  { name: "channel", length: 16, type: "string", is_null: true, default: null },
  { name: "from_tag", length: 64, type: "string", is_null: false, default: "" },
  { name: "to_tag", length: 64, type: "string", is_null: false, default: "" },

  { name: "event_index", length: 0, type: "int", is_null: true, default: null },
];

const EXPERIMENT_STAGING_FIELD_LIST = [
  { name: "app", length: 16, type: "string", is_null: false, default: "" },
  { name: "app_ver", length: 16, type: "string", is_null: false, default: "" },
  { name: "server_ver", length: 16, type: "string", is_null: true, default: null },
  { name: "config_ver", length: 16, type: "string", is_null: true, default: null },

  { name: "event_datetime", length: 0, type: "datetime", is_null: false, default: "" },

  { name: "device_tag", length: 64, type: "string", is_null: false, default: "" },

  { name: "experiment_name", length: 32, type: "string", is_null: false, default: "" },
  { name: "variant_name", length: 32, type: "string", is_null: false, default: "" },
];

const APP_LOG_FIELD_LIST = [
  { name: "app", length: 16, type: "string", is_null: false, default: "" },
  { name: "app_ver", length: 16, type: "string", is_null: false, default: "" },

  { name: "ingest_datetime", length: 0, type: "datetime", is_null: true, default: null },
  { name: "event_datetime", length: 0, type: "datetime", is_null: false, default: "" },

  { name: "hostname", length: 64, type: "string", is_null: true, default: null },
  { name: "filename", length: 256, type: "string", is_null: true, default: null },
  { name: "log_level", length: 16, type: "string", is_null: true, default: null },

  { name: "device_tag", length: 64, type: "string", is_null: true, default: null },
  { name: "user_tag", length: 64, type: "string", is_null: true, default: null },
  { name: "remote_address", length: 64, type: "string", is_null: true, default: null },
  { name: "response_bytes", length: 0, type: "int", is_null: true, default: null },
  { name: "response_ms", length: 0, type: "float", is_null: true, default: null },

  { name: "device_type", length: 32, type: "string", is_null: true, default: null },
  { name: "os", length: 16, type: "string", is_null: true, default: null },
  { name: "os_ver", length: 16, type: "string", is_null: true, default: null },
  { name: "browser", length: 16, type: "string", is_null: true, default: null },
  { name: "browser_ver", length: 16, type: "string", is_null: true, default: null },

  { name: "country", length: 2, type: "string", is_null: true, default: null },
  { name: "language", length: 5, type: "string", is_null: true, default: null },

  { name: "log_line", length: 65535, type: "string", is_null: true, default: null },
];

const TABLE_MAP = {
  install: INSTALL_FIELD_LIST,
  dau: DAU_FIELD_LIST,
  event: DAU_FIELD_LIST,
  economy: ECONOMY_FIELD_LIST,
  message_send: MSG_SEND_FIELD_LIST,
  message_click: MSG_SEND_FIELD_LIST,
  experiment: EXPERIMENT_STAGING_FIELD_LIST,
  app_log: APP_LOG_FIELD_LIST,
};

exports.TABLE_MAP = TABLE_MAP;
