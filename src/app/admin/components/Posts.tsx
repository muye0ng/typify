import {
  List,
  Datagrid,
  TextField,
  DateField,
  SelectField,
  ReferenceField,
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  Show,
  SimpleShowLayout,
  RichTextField,
  EditButton,
  ShowButton,
  DeleteButton,
} from 'react-admin'

const platformChoices = [
  { id: 'x', name: 'X (Twitter)' },
  { id: 'threads', name: 'Threads' },
]

const statusChoices = [
  { id: 'draft', name: 'Draft' },
  { id: 'scheduled', name: 'Scheduled' },
  { id: 'published', name: 'Published' },
  { id: 'failed', name: 'Failed' },
]

export const PostList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <ReferenceField source="user_id" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="content" />
      <SelectField source="platform" choices={platformChoices} />
      <SelectField source="status" choices={statusChoices} />
      <DateField source="scheduled_for" />
      <DateField source="published_at" />
      <DateField source="created_at" />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
)

export const PostEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="content" multiline rows={4} />
      <SelectInput source="platform" choices={platformChoices} />
      <SelectInput source="status" choices={statusChoices} />
      <TextInput source="scheduled_for" />
      <TextInput source="hashtags" />
    </SimpleForm>
  </Edit>
)

export const PostShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <ReferenceField source="user_id" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <RichTextField source="content" />
      <SelectField source="platform" choices={platformChoices} />
      <SelectField source="status" choices={statusChoices} />
      <TextField source="hashtags" />
      <DateField source="scheduled_for" />
      <DateField source="published_at" />
      <TextField source="engagement_metrics" />
      <DateField source="created_at" />
      <DateField source="updated_at" />
    </SimpleShowLayout>
  </Show>
)