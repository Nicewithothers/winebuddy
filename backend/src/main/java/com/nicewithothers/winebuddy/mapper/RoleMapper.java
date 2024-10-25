package com.nicewithothers.winebuddy.mapper;

import org.springframework.stereotype.Service;
import com.nicewithothers.winebuddy.models.Roles;
import java.util.ArrayList;
import java.util.Collection;

@Service
public class RoleMapper {
    public Collection<Roles> roleMapper(String roleList) {
        Collection<Roles> roles = new ArrayList<>();
        String[] roleStrings = roleList.split(", ");
        for (String role: roleStrings) {
            if (role.contains(Roles.ADMIN.toString())) {
                roles.add(Roles.ADMIN);
            }
            if (role.contains(Roles.USER.toString())) {
                roles.add(Roles.USER);
            }
        }
        return roles;
    }
}
