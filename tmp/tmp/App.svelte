<script>
  import Modal from 'svelte-simple-modal';
  import Page from './Page.svelte';
</script>

<Modal
  styleWindow={{ padding: '0px', 'background-color': 'transparent' }}
  styleContent={{ padding: '0px', 'background-color': 'transparent' }}
  styleCloseButton={{ top: '8px', right: '8px' }}
>
  <Page/>
</Modal>