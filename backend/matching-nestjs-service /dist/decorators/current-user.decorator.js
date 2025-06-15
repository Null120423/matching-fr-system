"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const user_entity_1 = require("../entities/user.entity");
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return (0, class_transformer_1.plainToClass)(user_entity_1.UserEntity, request.user);
});
//# sourceMappingURL=current-user.decorator.js.map