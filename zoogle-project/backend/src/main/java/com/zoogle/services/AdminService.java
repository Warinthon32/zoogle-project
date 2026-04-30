package com.zoogle.services;

import com.zoogle.models.Staff;
import com.zoogle.repositories.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.Collections;

@Service
public class AdminService implements UserDetailsService {

    @Autowired
    private StaffRepository staffRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Staff staff = staffRepository.findByUserName(username)
            .orElseThrow(() -> new UsernameNotFoundException("ไม่พบผู้ใช้: " + username));

        String role = "ROLE_" + staff.getStaffRole().toLowerCase();

        return new User(
            staff.getUserName(),
            staff.getPassWord(),
            Collections.singletonList(new SimpleGrantedAuthority(role))
        );
    }
}