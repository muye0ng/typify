import {
  List,
  Datagrid,
  TextField,
  EmailField,
  DateField,
  SelectField,
  BooleanField,
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  BooleanInput,
  Show,
  SimpleShowLayout,
  RichTextField,
  EditButton,
  ShowButton,
  DeleteButton,
} from 'react-admin'

const planChoices = [
  { id: 'free', name: 'Free' },
  { id: 'basic', name: 'Basic' },
  { id: 'pro', name: 'Pro' },
]

export const UserList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="name" />
      <EmailField source="email" />
      <SelectField source="plan" choices={planChoices} />
      <TextField source="industry" />
      <TextField source="tone" />
      <BooleanField source="onboarding_completed" />
      <DateField source="created_at" />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
)

export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="email" disabled />
      <SelectInput source="plan" choices={planChoices} />
      <TextInput source="industry" />
      <TextInput source="tone" />
      <BooleanInput source="onboarding_completed" />
    </SimpleForm>
  </Edit>
)

export const UserShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <EmailField source="email" />
      <SelectField source="plan" choices={planChoices} />
      <TextField source="industry" />
      <TextField source="tone" />
      <RichTextField source="topics" />
      <BooleanField source="onboarding_completed" />
      <DateField source="created_at" />
      <DateField source="updated_at" />
    </SimpleShowLayout>
  </Show>
)