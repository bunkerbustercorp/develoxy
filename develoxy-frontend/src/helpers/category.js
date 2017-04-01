export const flatten = (node, flat = [], parent= 'root', index=0, depth=0) => {

    const item = {
        name: node.name,
        parentId: node.parentId,
        index: node.index,
        id: node.id.toString(),
        depth
    };

    if(node.name !== '카테고리') {
        flat.push(item);
    }
    

    if(node.children) {
        node.children.forEach(
            (child ,i) => {
                flatten(child, flat, node.id, i, depth + 1);
            }
        );
    }
    return flat;
}

export const flattenWithId = (node, flat = [], parent= 'root', index=0, depth=0) => {
    flat[node.id] = {
        name: node.name,
        parentId: node.parentId,
        id: node.id.toString(),
        parent,
        index,
        depth
    };

    if(node.children) {
        node.children.forEach(
            (child ,i) => {
                flattenWithId(child, flat, node.id, i, depth + 1);
            }
        );
    }
    return flat;
}

export const orderify = (categories) => {
    // clone
    const data = categories.map(category => ({
        ...category
    }));

    const reference = {};

    data.forEach(
        (item) => {
            reference[item.id.toString()] = item;
        }
    )

    const keys = Object.keys(reference);

    const converted = keys.map(
        (key) => {
            let item = reference[key];
            let parent = reference[item.parentId.toString()];

            item.depth = 0;

            while(parent) {
                item.depth++;
                parent = reference[parent.parentId];
            }

            return item;
        }
    ).sort((a,b) => {

        if(a.depth === b.depth) {
            return a.index - b.index;
        }
        return a.depth - b.depth;
    })

    return converted;
}


export const treeize = (flat) => {

    const reference = {};

    flat.forEach(
        (item) => {
            reference[item.id.toString()] = item;
        }
    )

    const keys = Object.keys(reference);

    const converted = keys.map(
        (key) => {
            let item = reference[key];
            let parent = reference[item.parentId.toString()];

            item.depth = 0;

            while(parent) {
                item.depth++;
                parent = reference[parent.parentId];
            }

            return item;
        }
    ).sort((a,b) => {
        if(a.depth === b.depth) {
            return a.index - b.index;
        }
        return a.depth - b.depth;
    });

    const root = { name: '카테고리', id: 0 };

    reference['0'] = root;

    converted.forEach(
        (item) => {
            let parent = reference[item.parentId.toString()];
            if(!parent) parent = reference['0'];
            if(!parent.children) parent.children = [];
            parent.children.push(item);
        }
    );

    return root;
}


export const diff = (flat, nextFlat) => {
    // 새로생긴 아이템
    const keys = Object.keys(flat);

    for(let i = 0; i < keys.length; i++) {
        // 존재하는지 확인
        const key = keys[i];
        
        // index가 바뀌었는지 확인
        if(nextFlat[key].index !== flat[key].index || nextFlat[key].parent !== flat[key].parent) {
           return key;
        }
    }
}