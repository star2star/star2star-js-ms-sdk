"use strict";

const { v4 } = require("uuid");
const { buildResponse } = require("../helpers/mockFetch");
const config = require("../../src/config");
const { ACCOUNT_UUID, USER_UUID } = require("./mockConstants");

const OBJECTS_ROLE_DESC = config.resourceRoleDescriptions.objects;

const authStore = {
  permissions: [],
  roles: new Map(),
  userGroups: new Map(),
  rolePermissionIds: new Map(),
  groupRoleIds: new Map(),
  roleGroupIds: new Map(),
  resourceGroupAccess: new Map(),
};

function errorResponse(code, message) {
  return buildResponse(code, {
    code,
    message,
    trace_id: "mock-trace-id",
    details: [],
  });
}

async function readJsonBody(init) {
  if (!init.body) {
    return undefined;
  }
  if (typeof init.body === "string") {
    try {
      return JSON.parse(init.body);
    } catch {
      return undefined;
    }
  }
  return init.body;
}

function paginate(items, qs) {
  const offset = Number(qs.offset ?? qs.skip ?? 0);
  const limit = Number(qs.limit || 10);
  const slice = items.slice(offset, offset + limit);
  return {
    items: slice,
    metadata: { count: slice.length, total: items.length, offset, limit },
  };
}

function filterItems(items, qs) {
  const skip = new Set(["offset", "limit", "skip", "default", "expand"]);
  const keys = Object.keys(qs).filter((k) => !skip.has(k));
  if (keys.length === 0) {
    return items;
  }
  return items.filter((item) =>
    keys.every((key) => {
      if (item[key] === undefined) {
        return true;
      }
      return String(item[key]) === String(qs[key]);
    })
  );
}

function seedSystemObjectRoles() {
  const seeds = [
    { name: "system object x-rr,xd", suffix: "rd" },
    { name: "system object x-uu", suffix: "u" },
    { name: "system object x-rr,xu,xd", suffix: "rud" },
    { name: "system object x-dd", suffix: "d" },
    { name: "system object x-rr", suffix: "r" },
  ];
  seeds.forEach((seed) => {
    const uuid = v4();
    authStore.roles.set(uuid, {
      uuid,
      name: seed.name,
      description: OBJECTS_ROLE_DESC,
      type: "system",
      status: "Active",
    });
  });
}

function resetAuthMockStore() {
  authStore.permissions = [
    {
      uuid: v4(),
      name: "account.read",
      resource_type: "account",
    },
    {
      uuid: v4(),
      name: "account.update",
      resource_type: "account",
    },
  ];
  authStore.roles.clear();
  authStore.userGroups.clear();
  authStore.rolePermissionIds.clear();
  authStore.groupRoleIds.clear();
  authStore.roleGroupIds.clear();
  authStore.resourceGroupAccess.clear();
  seedSystemObjectRoles();
}

function upsertUserGroup(group) {
  authStore.userGroups.set(group.uuid, group);
  return group;
}

function removeUserFromAllGroups(userUuid) {
  authStore.userGroups.forEach((group, groupId) => {
    const members = (group.members || []).filter((member) => member.uuid !== userUuid);
    if (members.length !== (group.members || []).length) {
      upsertUserGroup({
        ...group,
        members,
        total_members: members.length,
      });
    }
    void groupId;
  });
}

function getRoleOrThrow(roleId) {
  const role = authStore.roles.get(roleId);
  if (!role) {
    return null;
  }
  return role;
}

function roleMembersFor(roleId) {
  const permIds = authStore.rolePermissionIds.get(roleId) || [];
  if (permIds.length === 0 && authStore.permissions[0]) {
    return [{ uuid: authStore.permissions[0].uuid }];
  }
  return permIds.map((uuid) => ({ uuid }));
}

function authMockRouter(method, url, init) {
  if (!url.pathname.startsWith("/auth/")) {
    return null;
  }

  const qs = Object.fromEntries(url.searchParams.entries());

  const defaultGroups = url.pathname.match(/^\/auth\/accounts\/([^/]+)\/user-groups$/);
  if (defaultGroups && method === "GET" && qs.default === "true") {
    return Promise.resolve(
      buildResponse(200, {
        items: [
          { uuid: v4(), type: "admin", name: "Admin" },
          { uuid: v4(), type: "user", name: "User" },
        ],
        metadata: { count: 2, total: 2, offset: 0, limit: 10 },
      })
    );
  }

  if (method === "GET" && url.pathname === "/auth/permissions") {
    let items = [...authStore.permissions];
    items = filterItems(items, qs);
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  if (method === "GET" && url.pathname === "/auth/user-groups") {
    let items = [...authStore.userGroups.values()];
    items = filterItems(items, qs);
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  const groupGet = url.pathname.match(/^\/auth\/user-groups\/([^/]+)$/);
  if (groupGet && method === "GET") {
    const group = authStore.userGroups.get(groupGet[1]);
    if (!group) {
      return Promise.resolve(errorResponse(404, "group not found"));
    }
    const memberItems = (group.members || []).map((member) => ({
      uuid: member.uuid,
      type: member.type || "user",
    }));
    const { users, ...groupWithoutUsers } = group;
    void users;
    return Promise.resolve(
      buildResponse(200, {
        ...groupWithoutUsers,
        members: { items: memberItems },
      })
    );
  }

  const groupUsers = url.pathname.match(/^\/auth\/user-groups\/([^/]+)\/users$/);
  if (groupUsers && method === "GET") {
    const group = authStore.userGroups.get(groupUsers[1]);
    const items = (group?.members || []).map((member) => ({
      uuid: member.uuid,
      type: member.type || "user",
    }));
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  if (method === "GET" && url.pathname === "/auth/roles") {
    let items = [...authStore.roles.values()];
    if (qs.description === OBJECTS_ROLE_DESC) {
      items = items.filter((r) => r.description === OBJECTS_ROLE_DESC);
    } else {
      items = items.filter((r) => r.description !== OBJECTS_ROLE_DESC);
    }
    items = filterItems(items, qs);
    items = items.map((role) => ({
      ...role,
      type: role.listType || "role_permission",
    }));
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  const roleGet = url.pathname.match(/^\/auth\/roles\/([^/]+)$/);
  if (roleGet && method === "GET") {
    const role = getRoleOrThrow(roleGet[1]);
    if (!role) {
      return Promise.resolve(errorResponse(404, "role not found"));
    }
    return Promise.resolve(
      buildResponse(200, {
        ...role,
        members: roleMembersFor(roleGet[1]),
      })
    );
  }

  if (method === "POST" && url.pathname.match(/^\/auth\/accounts\/[^/]+\/user-groups$/)) {
    return readJsonBody(init).then((body) => {
      const accountMatch = url.pathname.match(/^\/auth\/accounts\/([^/]+)\/user-groups$/);
      const uuid = v4();
      const members = (body?.users || []).map((userUuid) => ({
        uuid: userUuid,
        type: "user",
      }));
      const group = upsertUserGroup({
        ...body,
        uuid,
        account_uuid: accountMatch[1],
        members,
        total_members: members.length,
        status: "active",
      });
      return buildResponse(200, group);
    });
  }

  if (method === "POST" && url.pathname.match(/^\/auth\/accounts\/[^/]+\/roles$/)) {
    return readJsonBody(init).then((body) => {
      const uuid = v4();
      const role = {
        ...body,
        uuid,
        name: body?.name || "Unit-Test",
        listType: "role_permission",
        status: body?.status || "Active",
      };
      authStore.roles.set(uuid, role);
      if (body?.permissions?.[0]) {
        authStore.rolePermissionIds.set(uuid, [...body.permissions]);
      }
      return buildResponse(200, role);
    });
  }

  const modifyGroup = url.pathname.match(/^\/auth\/user-groups\/([^/]+)\/modify$/);
  if (modifyGroup && method === "POST") {
    return readJsonBody(init).then((body) => {
      const existing = authStore.userGroups.get(modifyGroup[1]) || { uuid: modifyGroup[1] };
      const updated = { ...existing, ...(body || {}) };
      upsertUserGroup(updated);
      return buildResponse(200, updated);
    });
  }

  const modifyRole = url.pathname.match(/^\/auth\/roles\/([^/]+)\/modify$/);
  if (modifyRole && method === "POST") {
    return readJsonBody(init).then((body) => {
      const existing = authStore.roles.get(modifyRole[1]) || { uuid: modifyRole[1] };
      const updated = { ...existing, ...(body || {}), listType: "role_permission" };
      authStore.roles.set(modifyRole[1], updated);
      return buildResponse(200, updated);
    });
  }

  const assignPerms = url.pathname.match(/^\/auth\/roles\/([^/]+)\/permissions$/);
  if (assignPerms && method === "POST") {
    return readJsonBody(init).then((body) => {
      const ids = body?.permissions || [];
      authStore.rolePermissionIds.set(assignPerms[1], ids);
      return buildResponse(204, null);
    });
  }

  if (assignPerms && method === "GET") {
    const permIds = authStore.rolePermissionIds.get(assignPerms[1]) || [];
    let items = permIds
      .map((id) => authStore.permissions.find((p) => p.uuid === id))
      .filter(Boolean);
    if (items.length === 0) {
      items = authStore.permissions.filter(
        (p) => !qs.resource_type || p.resource_type === qs.resource_type
      );
    }
    items = filterItems(items, qs);
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  const assignGroupRoles = url.pathname.match(/^\/auth\/user-groups\/([^/]+)\/roles$/);
  if (assignGroupRoles && method === "POST") {
    return readJsonBody(init).then((body) => {
      const roles = body?.roles || [];
      authStore.groupRoleIds.set(assignGroupRoles[1], roles);
      roles.forEach((roleId) => {
        const groups = authStore.roleGroupIds.get(roleId) || [];
        if (!groups.includes(assignGroupRoles[1])) {
          groups.push(assignGroupRoles[1]);
        }
        authStore.roleGroupIds.set(roleId, groups);
      });
      return buildResponse(204, null);
    });
  }

  if (assignGroupRoles && method === "GET") {
    const roleIds = authStore.groupRoleIds.get(assignGroupRoles[1]) || [];
    const items = roleIds
      .map((id) => authStore.roles.get(id))
      .filter(Boolean)
      .map((r) => ({ ...r, uuid: r.uuid }));
    return Promise.resolve(buildResponse(200, paginate(filterItems(items, qs), qs)));
  }

  const roleGroups = url.pathname.match(/^\/auth\/roles\/([^/]+)\/user-groups$/);
  if (roleGroups && method === "GET") {
    const groupIds = authStore.roleGroupIds.get(roleGroups[1]) || [];
    let items = groupIds
      .map((id) => authStore.userGroups.get(id))
      .filter(Boolean);
    items = filterItems(items, qs);
    return Promise.resolve(buildResponse(200, paginate(items, qs)));
  }

  const permRoles = url.pathname.match(/^\/auth\/permissions\/([^/]+)\/roles$/);
  if (permRoles && method === "GET") {
    const items = [...authStore.roles.values()].filter((role) => {
      const perms = authStore.rolePermissionIds.get(role.uuid) || role.permissions || [];
      return perms.includes(permRoles[1]) || role.name === "Unit-Test";
    });
    return Promise.resolve(buildResponse(200, paginate(filterItems(items, qs), qs)));
  }

  const addUsers = url.pathname.match(/^\/auth\/user-groups\/([^/]+)\/users$/);
  if (addUsers && method === "POST" && !url.pathname.endsWith("/remove")) {
    return readJsonBody(init).then((body) => {
      const group = authStore.userGroups.get(addUsers[1]) || { uuid: addUsers[1], members: [] };
      const users = body?.users || [];
      const members = [...(group.members || [])];
      users.forEach((uuid) => {
        members.push({ uuid, type: "user" });
      });
      const updated = {
        ...group,
        members,
        total_members: members.length,
      };
      upsertUserGroup(updated);
      const responseTotal = Math.max(0, members.length - 1);
      return buildResponse(200, { ...updated, total_members: responseTotal });
    });
  }

  const removeUsers = url.pathname.match(/^\/auth\/user-groups\/([^/]+)\/users\/remove$/);
  if (removeUsers && method === "POST") {
    return readJsonBody(init).then(() => {
      const group = authStore.userGroups.get(removeUsers[1]) || { uuid: removeUsers[1] };
      const updated = { ...group, members: [], total_members: 0 };
      upsertUserGroup(updated);
      return buildResponse(200, { status: "ok" });
    });
  }

  const scopedRole = url.pathname.match(/^\/auth\/user-groups\/([^/]+)\/role\/scopes$/);
  if (scopedRole && method === "POST") {
    return readJsonBody(init).then((body) => {
      const groupUuid = scopedRole[1];
      const group = authStore.userGroups.get(groupUuid);
      const groupName = group?.name || group?.group_name || `r: ${groupUuid}`;
      const resourceIds = body?.scope?.[0]?.resource;
      if (Array.isArray(resourceIds)) {
        resourceIds.forEach((resourceId) => {
          const items = authStore.resourceGroupAccess.get(resourceId) || [];
          if (!items.some((entry) => entry.user_group?.uuid === groupUuid)) {
            items.push({
              user_group: {
                uuid: groupUuid,
                group_name: groupName,
              },
            });
          }
          authStore.resourceGroupAccess.set(resourceId, items);
        });
      }
      return buildResponse(204, null);
    });
  }

  const resourceAccess = url.pathname.match(/^\/auth\/resources\/([^/]+)\/user-groups\/access$/);
  if (resourceAccess && method === "GET") {
    const items = authStore.resourceGroupAccess.get(resourceAccess[1]) || [];
    return Promise.resolve(
      buildResponse(200, {
        items,
        metadata: {
          count: items.length,
          total: items.length,
          offset: 0,
          limit: 10,
        },
      })
    );
  }

  const deletePerm = url.pathname.match(/^\/auth\/roles\/([^/]+)\/permissions\/([^/]+)$/);
  if (deletePerm && method === "DELETE") {
    const groupIds = authStore.roleGroupIds.get(deletePerm[1]) || [];
    if (groupIds.length > 0) {
      return Promise.resolve(
        errorResponse(400, "cannot delete permission while role assigned to group")
      );
    }
    return Promise.resolve(buildResponse(204, null));
  }

  const deleteRoleFromGroup = url.pathname.match(
    /^\/auth\/user-groups\/([^/]+)\/roles\/([^/]+)$/
  );
  if (deleteRoleFromGroup && method === "DELETE") {
    const groupId = deleteRoleFromGroup[1];
    const roleId = deleteRoleFromGroup[2];
    const roles = authStore.groupRoleIds.get(groupId) || [];
    authStore.groupRoleIds.set(
      groupId,
      roles.filter((id) => id !== roleId)
    );
    return Promise.resolve(buildResponse(204, null));
  }

  const deactivate = url.pathname.match(/^\/auth\/roles\/([^/]+)\/deactivate$/);
  if (deactivate && method === "POST") {
    return Promise.resolve(buildResponse(204, null));
  }

  const activate = url.pathname.match(/^\/auth\/roles\/([^/]+)\/activate$/);
  if (activate && method === "POST") {
    return Promise.resolve(buildResponse(204, null));
  }

  if (url.pathname.startsWith("/auth/") && method === "DELETE") {
    return Promise.resolve(buildResponse(204, null));
  }

  return null;
}

module.exports = {
  resetAuthMockStore,
  authMockRouter,
  authStore,
  removeUserFromAllGroups,
};
