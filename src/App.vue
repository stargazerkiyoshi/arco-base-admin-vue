<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div class="text-lg font-semibold">Arco Base Admin</div>
        <nav class="flex gap-4 text-sm font-medium text-slate-600">
          <RouterLink to="/" class="hover:text-slate-900">Home</RouterLink>
          <RouterLink to="/about" class="hover:text-slate-900">About</RouterLink>
        </nav>
      </div>
    </header>
    <main class="mx-auto max-w-5xl px-6 py-10">
      <RouterView />
    </main>
  </div>
</template>
