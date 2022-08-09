<script>
  import { selectedUsersForWhatsappCampaign } from "../../../stores/stores";

  export let row;

  $: checked = $selectedUsersForWhatsappCampaign.some(
    (user) => user.id === row.id
  );

  let handleCheckboxChange = (e) => {
    if (e.target.checked) {
      $selectedUsersForWhatsappCampaign = [
        ...$selectedUsersForWhatsappCampaign,
        row,
      ];
    } else {
      $selectedUsersForWhatsappCampaign =
        $selectedUsersForWhatsappCampaign.filter((user) => user.id !== row.id);
    }
  };
</script>

<input
  type="checkbox"
  class="user-checkbox"
  id="user-${row.id}"
  name="user-checkbox"
  value="${row.id}"
  on:change={handleCheckboxChange}
  {checked}
/>
