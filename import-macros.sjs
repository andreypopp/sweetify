let import = macro {
  rule { macros from $id:lit } => {}
  rule {} => { import }
}

export import;
