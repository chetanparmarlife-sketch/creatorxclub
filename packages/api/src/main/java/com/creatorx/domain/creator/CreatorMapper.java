package com.creatorx.domain.creator;

import com.creatorx.domain.creator.dto.CreatorProfileResponse;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CreatorMapper {

    @Mapping(target = "id", expression = "java(profile.getUserId())")
    @Mapping(target = "socialAccounts", source = "socialAccounts")
    CreatorProfileResponse toResponse(CreatorProfile profile, List<SocialAccount> socialAccounts);

    CreatorProfileResponse.SocialAccountResponse toResponse(SocialAccount socialAccount);
}
