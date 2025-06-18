# Vue Form Handler

A lightweight Vue 3 plugin for easy form handling with validation and error management.

## Installation

```bash
npm install @wuild/vue-forms
# or
yarn add @wuild/vue-forms
```

## Features

- 🚀 Simple form state management
- ✅ Built-in validation error handling
- 🔄 Form reset and dirty state tracking
- 📊 Form submission with progress tracking
- 🛡️ TypeScript support

## Usage

### Global Registration

```js
// main.js or main.ts
import { createApp } from 'vue'
import { FormPlugin } from '@wuild/vue-forms'
import App from './App.vue'

const app = createApp(App)
app.use(FormPlugin)
app.mount('#app')
```

### Basic Usage with Composition API

```vue
<template>
  <form @submit.prevent="form.submit(handleSubmit)">
    <div>
      <label for="name">Name:</label>
      <input id="name" v-model="form.name" type="text" />
      <div v-if="form.errors.name" class="error">
        {{ form.errors.name[0] }}
      </div>
    </div>

    <div>
      <label for="email">Email:</label>
      <input id="email" v-model="form.email" type="email" />
      <div v-if="form.errors.email" class="error">
        {{ form.errors.email[0] }}
      </div>
    </div>

    <button type="submit" :disabled="form.processing">
      {{ form.processing ? 'Submitting...' : 'Submit' }}
    </button>

    <div v-if="form.progress !== null">
      Upload progress: {{ form.progress }}%
    </div>
  </form>
</template>

<script setup>
import { useForm } from '@wuild/vue-forms'

// Initialize form with default values
const form = useForm({
  name: '',
  email: ''
})

// Form submission handler
const handleSubmit = async (data) => {
  try {
    // Send data to your API
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw { response: { data: errorData } }
    }
    
    // Handle successful submission
    alert('Form submitted successfully!')
    form.reset()
    
    return await response.json()
  } catch (error) {
    // Error handling is automatically done by the form handler
    console.error('Submission failed')
    throw error
  }
}
</script>
```

### Using with Options API

```vue
<template>
  <!-- Form template similar to above -->
</template>

<script>
export default {
  data() {
    return {
      // The form will be available as this.form
      form: this.$form({
        name: '',
        email: ''
      })
    }
  },
  methods: {
    async handleSubmit(data) {
      // Submission logic similar to above
    }
  }
}
</script>
```

## API Reference

### `useForm(initialData)`

Creates a form instance with the provided initial data.

**Parameters:**
- `initialData`: An object containing the initial form values

**Returns:**
A form instance with the following properties and methods:

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `processing` | `boolean` | Indicates if the form is currently being processed |
| `progress` | `number \| null` | Upload progress (0-100) or null if not applicable |
| `errors` | `object` | Object containing validation errors by field name |
| `isDirty` | `boolean` | Indicates if the form has been modified from its initial state |
| `hasErrors` | `boolean` | Indicates if the form has any validation errors |
| `reset()` | `function` | Resets the form to its initial state |
| `clearErrors()` | `function` | Clears all validation errors |
| `setError(field, message)` | `function` | Sets a validation error for a specific field |
| `submit(callback)` | `function` | Submits the form using the provided callback function |
| `getFields()` | `function` | Returns a plain object with all form fields |

### Error Handling

The form handler automatically handles errors from API responses in the following format:

```json
{
  "errors": {
    "email": ["Email is invalid", "Email is already taken"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

## TypeScript Support

The form handler is fully typed and provides type inference for your form data:

```typescript
interface UserForm {
  name: string;
  email: string;
  age: number;
}

const form = useForm<UserForm>({
  name: '',
  email: '',
  age: 0
})

// form.name will be typed as string
// form.age will be typed as number
```

## License

MIT