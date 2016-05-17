'use strict';

const _ = require('lodash');
const fs = require('fs');
const TABLE_MAP = require('./dc_schema.js').TABLE_MAP;

const DATETIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}\:\d{2}\:\d{2}(\.\d{3})?Z?$/;

exports.init = init;
exports.closeFiles = closeFiles;
exports.rawEvent = rawEvent;

exports.log = rawEvent.bind(null,'app_log');
exports.install = rawEvent.bind(null,'install');
exports.dau = rawEvent.bind(null,'dau');
exports.event = rawEvent.bind(null,'event');
exports.economy = rawEvent.bind(null,'economy');
exports.messageSend = rawEvent.bind(null,'message_send');
exports.messageClick = rawEvent.bind(null,'message_click');
exports.experiment = rawEvent.bind(null,'experiment');

let g_filePrefix = false;
let g_defaultEvent = {};

const g_bufferMap = {};
const g_writerMap = {};

function init(opts) {
  if (!opts.filePrefix) {
    throw new Error("opts.filePrefix is required");
  }
  g_filePrefix = opts.filePrefix;
  g_defaultEvent = opts.defaultEvent || {};

  if (!opts.noHupHandler) {
    process.on('SIGHUP',closeFiles);
  }
}

function closeFiles() {
  _.each(g_writerMap,(writer,table) => {
    writer.end();
    delete g_writerMap[table];
  });
}

function rawEvent(table,event_list) {
  const field_list = TABLE_MAP[table];
  if (!field_list) {
    throw new Error("unknown table: " + table);
  }

  if (!Array.isArray(event_list)) {
    event_list = [event_list];
  }

  const now = (new Date).toISOString();
  _.each(event_list,(e) => {
    if (!e.ingest_datetime) {
      e.ingest_datetime = now;
    }
    if (!e.event_datetime) {
      e.event_datetime = now;
    }
  });

  const line_list = _.map(event_list,(e) => eventToLine(field_list,e));

  if (table in g_writerMap) {
    tableWrite(table,line_list);
  } else {
    if (table in g_bufferMap) {
      Array.prototype.push.apply(g_bufferMap[table],line_list);
    } else {
      g_bufferMap[table] = line_list;
    }
    openFile(table);
  }
}

const g_lockMap = {};
function openFile(table) {
  if (g_filePrefix) {
    if (!g_lockMap[table]) {
      g_lockMap[table] = true;
      const file_name = g_filePrefix + table + ".csv";
      const opts = {
        flags: 'a',
      };
      const writer = fs.createWriteStream(file_name,opts);
      writer.on('error',() => {
        delete g_writerMap[table];
      });

      g_writerMap[table] = writer;
      const line_list = g_bufferMap[table];
      if (line_list) {
        delete g_bufferMap[table];
        tableWrite(table,line_list);
      }
      g_lockMap[table] = false;
    }
  }
}

function tableWrite(table,line_list) {
  const string = line_list.join("");
  const writer = g_writerMap[table];
  writer.write(string,'utf8');
}

function eventToLine(field_list,event) {
  event = _.extend({},this,event);

  const value_array = [];
  _.each(field_list,(column_detail) => {
    const column = column_detail.name;

    let val = "";
    if (column in event) {
      val = event[column];
    } else if (column in g_defaultEvent) {
      val = g_defaultEvent[column];
    } else {
      val = column_detail.default;
    }

    if (column_detail.type == "float") {
      if (!isNumber(val)) {
        val = column_detail.default;
      }
    } else if( column_detail.type == "int" ) {
      if (!isInt(val)) {
        val = column_detail.default;
      }
    } else if (column_detail.type == "string") {
      val = escape_value(val,column_detail.length);
    } else if (column_detail.type == "datetime") {
      if (val instanceof Date) {
        val = val.toISOString();
      } else if( !DATETIME_REGEX.test(val) ) {
        if( column_detail.is_null ) {
          val = null;
        } else {
          throw "bad datetime for required column: " + column;
        }
      }
    }

    if (!column_detail.is_null && ( val === null || val == "\\N")) {
      val = column_detail.default;
    }
    if (val === null) {
      val = "\\N";
    }

    value_array.push(val);
  });

  return value_array.join(',') + "\n";
};


function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
function isInt(n) {
  const int = parseInt(n);
  return int == n && !isNaN(int) && isFinite(n);
}

function escape_value(value,max_length) {
  let ret_value = false;
  if (typeof value == 'number') {
    ret_value = value.toString();
    if (ret_value.length > max_length) {
      ret_value = ret_value.slice(0,max_length);
    }
  } else if (typeof value == 'string') {
    let needs_quoted = false;
    const out_array = [];
    for( let i = 0 ; i < value.length ; ++i ) {
      let c = value[i];
      const code = c.charCodeAt(0);
      if( code == 34  ) {
        needs_quoted = true;
      } else if( code == 39 ) {
        needs_quoted = true;
      } else if( code == 44 ) {
        needs_quoted = true;
      } else if( code == 92 ) {
        needs_quoted = true;
      } else if( code < 32 ) {
        needs_quoted = true;
        c = "%" + code.toString(16)
      } else if( code > 126 ) {
        needs_quoted = true;
        c = "%" + code.toString(16);
      }
      out_array.push(c);
    }
    ret_value = out_array.join('');
    if (ret_value.length > max_length) {
      ret_value = ret_value.slice(0,max_length);
    }
    if (needs_quoted) {
      ret_value = ret_value.replace(/"/g,'""');
      ret_value = "\"" + ret_value + "\"";
    }
  } else if (typeof value == 'boolean') {
    ret_value = value ? "1" : "0";
  } else if (value == null) {
    ret_value = null;
  } else {
    ret_value = null;
  }
  return ret_value;
}
