import { column, Schema, Table } from "@powersync/web";
// OR: import { column, Schema, Table } from '@powersync/react-native';

const users = new Table(
  {
    // id column (text) is automatically included
    auth_user_id: column.text,
    short_id: column.text,
    full_name: column.text,
    nickname: column.text,
    contact_number: column.text,
    role: column.text,
    qr_token: column.text,
    created_at: column.text,
    updated_at: column.text,
  },
  { indexes: {} },
);

const members = new Table(
  {
    // id column (text) is automatically included
    status: column.text,
    started_date: column.text,
    valid_until: column.text,
    membership_type_id: column.integer,
    coach_id: column.text,
  },
  { indexes: {} },
);

const staff = new Table(
  {
    // id column (text) is automatically included
    subrole: column.text,
    last_active: column.text,
  },
  { indexes: {} },
);

const membership_types = new Table(
  {
    // id column (text) is automatically included
    name: column.text,
    monthly_fee: column.text,
    student_fee: column.text,
    created_at: column.text,
  },
  { indexes: {} },
);

const attendance_logs = new Table(
  {
    // id column (text) is automatically included
    user_id: column.text,
    check_in_time: column.text,
    status_at_scan: column.text,
    created_at: column.text,
  },
  { indexes: {} },
);

export const AppSchema = new Schema({
  users,
  members,
  staff,
  membership_types,
  attendance_logs,
});

export type Database = (typeof AppSchema)["types"];
